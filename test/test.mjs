import JSD from 'jsdom'

const dom = new JSD.JSDOM('<html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document

import { withContext } from '../src/with'
import hyper from 'hyperapp'
const { h, app: _app } = hyper
const app = withContext(_app)

const step = new Promise(r => setTimeout(r, 0))

const createContainer = () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  return el
}

const Context = (props, children) => (context, setContext) => {
  setContext(props)
  return children
}

export default [
  {
    info: 'withContext allows context aware components',
    fn: async () => {
      const el = createContainer()
      const Component = props => context => h('div', { id: 'component' }, ['foo'])
      const view = (state, actions) => h('main', {}, [h(Component, {}, [])])
      app({}, {}, view, el)

      await step

      return el.innerHTML
    },
    expect: '<main><div id="component">foo</div></main>',
  },
  {
    info: 'props on Context are available to context-aware descendants',
    fn: async () => {
      const el = createContainer()
      const Component = _ => ({ foo, bar }) => h('span', { id: foo }, [bar])
      const Passthru = _ => h('p', {}, [h(Component, {})])
      const view = _ =>
        h('main', {}, [h(Context, { foo: 'foo', bar: 'bar' }, [h(Passthru, {}, [])])])
      app({}, {}, view, el)

      await step

      return el.innerHTML
    },
    expect: '<main><p><span id="foo">bar</span></p></main>',
  },
  {
    info: 'the view can write to context same as components',
    fn: async () => {
      const el = createContainer()
      const Component = _ => ({ foo, bar }) => h('span', { id: foo }, [bar])
      const Passthru = _ => h('p', {}, [h(Component, {})])
      const view = _ => (_, setContext) => {
        setContext({ foo: 'foo', bar: 'bar' })
        return h(Passthru, {}, [])
      }
      app({}, {}, view, el)

      await step

      return el.innerHTML
    },
    expect: '<p><span id="foo">bar</span></p>',
  },
  {
    info: 'context-aware components can be nested',
    fn: async () => {
      const el = createContainer()
      const Passthru1 = _ => h('section', {}, [h(Component1, {})])
      const Component1 = _ => ({ foo }) => h('div', { id: foo }, [h(Passthru2, {})])
      const Passthru2 = _ => h('p', {}, [h(Component2, {})])
      const Component2 = _ => ({ bar }) => h('span', {}, [bar])
      const view = _ =>
        h('main', {}, [h(Context, { foo: 'foo', bar: 'bar' }, [h(Passthru1, {}, [])])])
      app({}, {}, view, el)

      await step

      return el.innerHTML
    },
    expect: '<main><section><div id="foo"><p><span>bar</span></p></div></section></main>',
  },
  {
    info: 'Context applies context only within its range',
    fn: async () => {
      const el = createContainer()
      const Component = _ => ({ foo, bar, baz }) => h('span', {}, [foo, bar, baz])
      const view = _ =>
        h(Context, { foo: 'foo', bar: 'bar' }, [
          h('main', {}, [
            h(Context, { bar: 'baz', baz: 'bop' }, [h(Component, {})]),
            h(Component, {}),
          ]),
        ])
      app({}, {}, view, el)

      await step

      return el.innerHTML
    },
    expect: '<main><span>foobazbop</span><span>foobar</span></main>',
  },
]
