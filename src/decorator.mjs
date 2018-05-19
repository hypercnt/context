import processor from './processor'

export const wrapEvent = (oh, dh) =>
  !oh
    ? dh
    : (a, b) => {
        oh(a, b)
        dh(a, b)
      }
export const wrapClass = (oc, dc) => `${oc ? oc + ' ' : ''}${dc ? dc : ''}`

export const decorator = getDecoration =>
  processor((props, children, context) => {
    const decoration = getDecoration(props, context)

    return children.map(child => {
      if (!child.attributes) {
        return child
      }

      Object.keys(decoration).forEach(name => {
        if (name === 'class') {
          child.attributes.class = wrapClass(child.attributes.class, decoration.class)
        } else if (name.substr(0, 2) === 'on') {
          child.attributes[name] = wrapEvent(child.attributes[name], decoration[name])
        } else {
          child.attributes[name] = decoration[name]
        }
      })
      return child
    })
  })

export default decorator
