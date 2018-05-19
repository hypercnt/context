import resolveNode from './resolve'

export const processor = proc => (props, children) => context =>
  proc(props, resolveNode(children), context)

export default processor
