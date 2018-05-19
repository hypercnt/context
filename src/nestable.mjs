import { h, app } from 'hyperapp'
import resolveNode from './resolve'

export const viewHandler = (s, a) => {
  let node = view(s, a)
  if (typeof node === 'function') node = node(el._$p, el._$c)
  node = resolveNode(node, el._$x)
  return node && node.length ? node[0] : node
}

export const nestable = (state, actions, view, tagname) => {
  actions._$r = () => ({})

  return (props, children) => context =>
    h(tagname || 'x-', {
      key: props.key,
      id: props.id,
      class: props.class,
      oncreate: el => {
        el._$p = props
        el._$c = children
        el._$x = context
        const wired = app(state, actions, viewHandler(view), el)
        el._$r = wired._$r
        el._$u = wired.uninit
        wired.init && wired.init(props)
        props.oncreate && props.oncreate(el)
      },
      onupdate: el => {
        el._$p = props
        el._$c = children
        el._$x = context
        el._$r()
        props.onupdate && props.onupdate(el)
      },
      ondestroy: el => {
        el._$u && el._$u()
        props.ondestroy && props.ondestroy(el)
      },
    })
}

export default nestable
