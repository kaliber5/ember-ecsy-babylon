import { Component, createComponentClass } from 'ecsy';
import { Material } from '@babylonjs/core';

export interface MaterialComponent extends Component {
  value: Material;
  sideOrientation: number;
  useObjectSpaceNormalMap: boolean;
}

export default createComponentClass<MaterialComponent>({
  value: { default: null }
}, 'Material');
