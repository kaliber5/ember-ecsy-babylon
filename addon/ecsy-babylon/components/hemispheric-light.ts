import { LightComponent, schema } from './-private/light-component';
import { createComponentClass } from 'ecsy';
import { HemisphericLight, Vector3} from '@babylonjs/core';
import Types from '../types';

interface HemisphericLightComponent extends LightComponent {
  direction: Vector3;
  light?: HemisphericLight;
}

export default createComponentClass<HemisphericLightComponent>({
  ...schema,
  direction: { default: new Vector3(0, 1, 0), type: Types.Vector3 },
  intensity: { default: 1 },
  light: { default: undefined },
}, 'HemisphericLight');
