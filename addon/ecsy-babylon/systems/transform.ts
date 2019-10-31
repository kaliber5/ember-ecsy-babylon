import { Entity, System } from 'ecsy';
import EntityComponent from 'ember-babylon/ecsy/components/entity';
import { Position, Rotation, TransformNode } from '../components';
import { TransformNode as BabylonTransformNode } from '@babylonjs/core';
import { guidFor } from '@ember/object/internals';
import { assert } from '@ember/debug';

export default class TransformSystem extends System {
  execute() {
    this.queries.entity.added.forEach((e: Entity) => this.setup(e));

    this.queries.position.added.forEach((e: Entity) => this.position(e));
    this.queries.position.changed.forEach((e: Entity) => this.position(e));
    this.queries.rotation.added.forEach((e: Entity) => this.rotation(e));
    this.queries.rotation.changed.forEach((e: Entity) => this.rotation(e));
    // TODO: implement removed for the above

    this.queries.entity.removed.forEach((e: Entity) => this.remove(e));
  }

  setup (entity: Entity) {
    const entityComponent = entity.getComponent(EntityComponent);
    const parentEntity = entityComponent.parent;
    const transformNode = new BabylonTransformNode(`${guidFor(entity)}__TransformNode`);

    if (parentEntity) {
      const parentTransformNodeComponent = parentEntity.getComponent(TransformNode);

      assert('The parent <Entity/> does not have a valid TransformNode ECSY component', !!(parentTransformNodeComponent && parentTransformNodeComponent.value));

      transformNode.parent = parentTransformNodeComponent.value;
    }

    entity.addComponent(TransformNode, { value: transformNode });
  }

  remove (entity: Entity) {
    // the TransformNode component might already be removed if the Entity was removed
    const transformNodeComponent = entity.getComponent(TransformNode) || entity.getRemovedComponent(TransformNode);

    if (!transformNodeComponent || !transformNodeComponent.value) {
      throw new Error('TransformNode Component does not have a valid TransformNode instance.');
    }

    // we do not recursively dispose of all children of this transform node, they will clean up themselves
    transformNodeComponent.value.dispose(true);
    entity.removeComponent(TransformNode);
  }

  getTransformNode (entity: Entity): BabylonTransformNode {
    const transformNodeComponent = entity.getComponent(TransformNode);

    assert('No valid ECSY TransformNode component found on this Entity.', !!(transformNodeComponent && transformNodeComponent.value));

    // @ts-ignore
    return transformNodeComponent.value;
  }

  position (entity: Entity) {
    const tn = this.getTransformNode(entity);
    const positionComponent = entity.getComponent(Position);
    tn.position = positionComponent.value;
  }

  rotation (entity: Entity) {
    const tn = this.getTransformNode(entity);
    const rotationComponent = entity.getComponent(Rotation);

    let {
      x,
      y,
      z
    } = rotationComponent.value;

    x = x * Math.PI / 180;
    y = y * Math.PI / 180;
    z = z * Math.PI / 180;

    Object.assign(tn.rotation, { x, y, z});
  }
}

TransformSystem.queries = {
  entity: {
    components: [EntityComponent],
    listen: {
      added: true,
      removed: true
    }
  },
  position: {
    components: [TransformNode, Position],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  },
  rotation: {
    components: [TransformNode, Rotation],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  }
};
