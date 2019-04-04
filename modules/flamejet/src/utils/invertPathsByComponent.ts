import {ComponentsByPort, PortsByComponent} from "../types";

/**
 * TODO: Add tests
 * @param bundles
 */
export function invertPathsByComponent<P extends string>(
  bundles: ComponentsByPort<P>
): PortsByComponent<P> {
  const result = <PortsByComponent<P>>{};
  for (const port in bundles) {
    const bundle = bundles[port];
    for (const path of bundle) {
      const ports = result[path] = result[path] || [];
      ports.push(port);
    }
  }
  return result;
}
