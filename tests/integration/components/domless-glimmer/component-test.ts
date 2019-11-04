import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import DomlessGlimmerComponent from 'ember-babylon/components/domless-glimmer/component';
import { TestContext } from "ember-test-helpers";



module('Integration | Component | domless-glimmer', function(hooks) {
  setupRenderingTest(hooks);

  let receivedCreateArgs: any;
  let receivedUpdateArgs: any;

  class DummyComponent extends DomlessGlimmerComponent {
    constructor(owner: any, args: any) {
      super(owner, args);
      // Using Object.assign to "bake" the Proxy which args is, which does not work well with assertions
      receivedCreateArgs = Object.assign({}, args);
    }

    didUpdate(args: any) {
      super.didUpdate(args);
      receivedUpdateArgs = Object.assign({}, args);
    }
  }

  hooks.beforeEach(function(this: TestContext) {
    this.owner.register('component:domless-glimmer', DummyComponent);
    this.owner.register('template:domless-glimmer', hbs`{{yield}}`);
    receivedCreateArgs = undefined;
    receivedUpdateArgs = undefined;
  });

  test('it renders', async function(assert) {
    await render(hbs`<DomlessGlimmer>Foo</DomlessGlimmer>`);

    assert.dom(this.element).hasText('Foo');
  });

  test('it receives arguments', async function(assert) {
    this.set('foo', 'bar');
    await render(hbs`<DomlessGlimmer @foo={{this.foo}} />`);

    assert.deepEqual(receivedCreateArgs, { foo: 'bar' });
  });

  test('it receives updated arguments', async function(assert) {
    this.set('foo', 'xxx');
    await render(hbs`<DomlessGlimmer @foo={{this.foo}} />`);

    this.set('foo', 'bar');
    await settled();

    assert.deepEqual(receivedUpdateArgs, { foo: 'bar' });
  });

  test('it receives updates only for real changes', async function(assert) {
    this.set('foo', 'xxx');
    await render(hbs`<DomlessGlimmer @foo={{this.foo}} />`);

    this.set('foo', 'xxx');
    await settled();

    assert.equal(receivedUpdateArgs, undefined);
  });

  test('it receives diff of updated arguments', async function(assert) {
    this.set('x', 0);
    this.set('y', 0);
    await render(hbs`<DomlessGlimmer @x={{this.x}} @y={{this.y}} />`);

    this.set('y', 1);
    await settled();

    assert.deepEqual(receivedUpdateArgs, { y: 1 });
  });


});
