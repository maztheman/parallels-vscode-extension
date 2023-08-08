import {NewVirtualMachineFlags} from "./NewVirtualMachineFlags";
import {NewVirtualMachineSpecs} from "./NewVirtualMachineSpecs";

export interface NewVirtualMachineRequest {
  name: string;
  os: string;
  platform: string;
  distro: string;
  image: string;
  specs: NewVirtualMachineSpecs;
  flags: NewVirtualMachineFlags;
  isoUrl?: string;
  isoChecksum?: string;
  addons: string[];
}
