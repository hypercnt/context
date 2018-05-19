export const resolveNode = (node, context) => {
  context = context || {}
  if (node == null) return node
  if (typeof node === 'function') {
    return resolveNode(
      node(context, props => {
        context = Object.assign({}, context, props)
      }),
      context,
    )
  }
  if (Array.isArray(node)) {
    node = node.map(n => resolveNode(n, context))
    node = Array.prototype.concat.apply([], node)
    node = node.filter(n => n != null)
    return node
  }
  if (!node.attributes) {
    return node
  }

  return {
    nodeName: node.nodeName,
    attributes: Object.assign({}, node.attributes),
    children: resolveNode(node.children, context),
  }
}

export default resolveNode
