/* jshint node:true */
const {resolve} = require("path");

module.exports = function (grunt) {
  "use strict";

  const modules = [
    "core",
    "model",
    "routing",
    "view-dom",
    "view-dom-lib",
    "demo"
  ];

  grunt.initConfig({
    clean: modules.reduce((config, module) => {
      config[`${module}-package-lock`] = [`modules/${module}/package-lock.json`];
      config[`${module}-dist`] = [`modules/${module}/dist`];
      config[`${module}-node_modules`] = [`modules/${module}/node_modules`];
      return config;
    }, {
      "node_modules": ["node_modules"],
      "package-lock": ["package-lock.json"]
    }),

    copy: {
      demo: {
        src: ["modules/demo/src/index.html"],
        dest: "modules/demo/dist/",
        expand: true,
        flatten: true
      }
    },

    watch: modules.reduce((config, module) => {
      config[module] = {
        files: [`modules/${module}/src/**/*.ts`],
        tasks: [`build-quick-${module}`]
      };
      return config;
    }, {}),

    tslint: modules.reduce((config, module) => {
      config[module] = {
        options: {
          configuration: "tslint.json"
        },
        files: {
          src: [`modules/${module}/src/**/*.ts`]
        }
      };
      return config;
    }, {}),

    webpack: {
      demo: {
        entry: `./modules/demo/src/index.ts`,
        output: {
          filename: "bundle.js",
          path: `${__dirname}/modules/demo/dist`
        },
        mode: "production",
        devtool: "source-map",
        module: {
          rules: [
            {test: /\.ts$/, use: "ts-loader"},
            {test: /\.js$/, use: "source-map-loader", enforce: "pre"}
          ]
        },
        resolve: {
          extensions: [".ts", ".js"]
        }
      }
    },

    exec: modules.reduce((config, module) => {
      config[`ts-${module}`] = {
        cwd: `modules/${module}`,
        cmd: resolve("node_modules/.bin/tsc")
      };
      config[`jasmine-${module}`] = {
        cwd: `modules/${module}`,
        cmd: `${resolve("node_modules/.bin/jasmine")} dist/**/*.spec.js`
      };

      const pkg = grunt.file.readJSON(`modules/${module}/package.json`);
      const deps = Object.keys(pkg.dependencies || {})
      .filter((name) => /^(river|gravel).*$/.test(name));
      config[`link-${module}-deps`] = {
        cwd: `modules/${module}`,
        cmd: deps
        .map((dep) => `npm ln ${dep}`)
        .join(" && ") || "echo noop"
      };
      config[`link-${module}-self`] = {
        cwd: `modules/${module}`,
        cmd: "npm ln",
        exitCode: [0, 1]
      };
      config[`unlink-${module}`] = {
        cwd: `modules/${module}`,
        cmd: "npm unlink"
      };

      return config;
    }, {}),

    notify: modules.reduce((config, module) => {
      config[`build-${module}`] = {
        options: {
          message: `Module "${module}" built.`
        }
      };
      config[`test-${module}`] = {
        options: {
          message: `Tests for "${module}" passed.`
        }
      };
      return config;
    }, {
      build: {
        options: {
          message: "All modules built."
        }
      }
    })
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-tslint");
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-notify");

  modules.forEach((module) => {
    grunt.registerTask(`postinstall-${module}`, [
      `exec:link-${module}-deps`,
      `exec:link-${module}-self`
    ]);
    grunt.registerTask(`test-${module}`, [
      `tslint:${module}`,
      `exec:jasmine-${module}`
    ]);
    grunt.registerTask(`build-quick-${module}`, [
      `clean:${module}-dist`,
      `exec:ts-${module}`, `notify:build-${module}`
    ]);
    grunt.registerTask(`build-${module}`, [
      `clean:${module}-dist`,
      `tslint:${module}`, `exec:ts-${module}`,
      `test-${module}`, `notify:build-${module}`
    ]);
  });
  grunt.registerTask("clean-dist", modules
  .map((module) => `clean:${module}-dist`));
  grunt.registerTask("clean-package-lock", modules
  .map((module) => `clean:${module}-package-lock`)
  .concat("clean:package-lock"));
  grunt.registerTask("clean-node_modules", modules
  .reduce((tasks, module) => {
    tasks.push(`clean:${module}-node_modules`);
    tasks.push(`exec:unlink-${module}`);
    return tasks;
  }, ["clean:node_modules"]));
  grunt.registerTask("ts", modules
  .map((module) => `exec:ts-${module}`));
  grunt.registerTask("test", modules
  .map((module) => `test-${module}`));
  grunt.registerTask("build-quick", ["clean-dist", "ts", "notify:build"]);
  grunt.registerTask("build", [
    "clean-dist", "tslint", "ts", "test", "notify:build"]);
  grunt.registerTask("bundle", ["copy:demo", "webpack:demo"]);
  grunt.registerTask("postinstall", modules
  .map((module) => `postinstall-${module}`));
  grunt.registerTask("default", ["build-quick", "watch"]);
};
