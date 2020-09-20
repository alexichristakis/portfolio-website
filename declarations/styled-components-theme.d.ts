import "styled-components";

import { Theme } from "../src/lib/theme";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
