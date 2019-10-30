import { Component, createComponentClass } from 'ecsy';
import { Mesh } from '@babylonjs/core';
import Types from '../types';

interface SphereComponent extends Component {
  segments: number;
  diameter: number;
  diameterX?: number;
  diameterY?: number;
  diameterZ?: number;
  arc: number;
  slice: number;
  updatable: boolean;
  sideOrientation: number;
}

export default createComponentClass<SphereComponent>({
  segments: { default: 32 },
  diameter: { default: 1 },
  diameterX: { type: Types.OptionalNumber },
  diameterY: { type: Types.OptionalNumber },
  diameterZ: { type: Types.OptionalNumber },
  arc: { default: 1 },
  slice: { default: 1 },
  updatable: { default: false },
  sideOrientation: { default: Mesh.DEFAULTSIDE }
}, 'Sphere');
