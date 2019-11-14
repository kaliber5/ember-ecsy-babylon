import { Entity } from 'ecsy';
import EntityComponent from '@kaliber5/ember-ecsy-babylon/ecsy/components/entity';
import { Mesh, PBRMaterial, Material } from '../components';
import { Mesh as BabylonMesh, PBRMaterial as BabylonPBRMaterial } from '@babylonjs/core';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import SystemWithCore, { queries } from '../SystemWithCore';

export default class MaterialSystem extends SystemWithCore {
  execute() {
    super.execute();

    this.queries.PBRMaterial.added.forEach((e: Entity) => this.setupPBRMaterial(e));
    this.queries.PBRMaterial.changed.forEach((e: Entity) => this.updatePBRMaterial(e));
    this.queries.PBRMaterial.removed.forEach((e: Entity) => this.removePBRMaterial(e));

    this.queries.Material.added.forEach((e: Entity) => this.setup(e));
    this.queries.Material.changed.forEach((e: Entity) => this.setup(e));
    this.queries.Material.removed.forEach((e: Entity) => this.remove(e));
  }

  getMesh (entity: Entity, removed = false): BabylonMesh {
    // Optionally allow getting the TransformNode as a removed component.
    // Useful in the case where the entire Entity is being removed.
    const meshComponent = removed
      ? entity.getComponent(Mesh) || entity.getRemovedComponent(Mesh)
      : entity.getComponent(Mesh);

    assert('No valid ECSY Mesh component found on this Entity.', !!(meshComponent && meshComponent.value));

    // @ts-ignore
    return meshComponent.value;
  }

  setup (entity: Entity) {
    const mesh = this.getMesh(entity);
    const materialComponent = entity.getComponent(Material);

    if (materialComponent.value) {
      mesh.material = materialComponent.value;
    } else {
      console.warn(`No material was applied to mesh "${mesh.name}".`);
    }
  }

  remove (entity: Entity) {
    const mesh = this.getMesh(entity, true);

    if (mesh.material) {
      mesh.material.dispose();
    }

    mesh.material = null;
  }

  setupPBRMaterial (entity: Entity) {
    const materialComponent = entity.getComponent(PBRMaterial);

    const material = new BabylonPBRMaterial(`${guidFor(entity)}__PBRMaterial`, this.core.scene);
    Object.assign(material, materialComponent);

    entity.addComponent(Material, { value: material });
  }

  updatePBRMaterial (entity: Entity) {
    const mesh = this.getMesh(entity);
    const materialComponent = entity.getComponent(PBRMaterial);

    Object.assign(mesh.material, materialComponent);
  }

  removePBRMaterial (entity: Entity) {
    entity.removeComponent(Material);
  }
}

MaterialSystem.queries = {
  ...queries,
  entity: {
    components: [EntityComponent],
    listen: {
      added: true,
      removed: true
    }
  },
  Material: {
    components: [Mesh, Material],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  },
  PBRMaterial: {
    components: [Mesh, PBRMaterial],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  }
};
