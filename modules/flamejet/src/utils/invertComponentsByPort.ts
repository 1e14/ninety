import {ComponentsByPort, PortsByComponent} from "../types";

/**
 * Inverts path component to port associations.
 * @param bundles Path component bundles indexed by ports.
 * TODO: Add tests
 */
export function invertComponentsByPort<P extends string>(
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
