import * as assert from 'assert'

import { VNode } from '../types'
import { h } from './h'

describe('h', () => {

  describe('given a selector representing a tagName', () => {
    it('returns a vNode with tagName property of same value', () => {
      const tagName = 'div'

      const vNode = h(tagName)

      assert.strictEqual(vNode.tagName, tagName)
    })
  })

  describe('given a props object as second parameter', () => {
    it('correctly sets vNode.props', () => {
      const props = {}

      const vNode = h('div', props)

      assert.strictEqual(vNode.props, props)
    })
  })

  describe('given children as second parameter', () => {
    it('correctly sets vNode.children', () => {
      const children: Array<VNode> = [ h('div') ]

      const vNode = h('div', children)

      assert.deepEqual(vNode.children, children)
    })

    it('sets parent property on children to parent vNode', () => {
      const children: Array<VNode> = [ h('div') ]

      const vNode = h('div', children)

      if (!vNode.children)
        throw new Error(`VNode should have children`)

      assert.strictEqual(vNode.children[0].parent, vNode)
    })
  })

  describe('given text as second parameter', () => {
    it('correctly sets vNode.text', () => {
      const text = 'hello'

      const vNode = h('div', text)

      assert.strictEqual(vNode.text, text)
    })
  })

  describe('given a selector props and children', () => {
    it('correctly sets children property', () => {
      const vNodeChildren = [ h('h1', 'Hi') ]
      const vNode = h('div', {}, vNodeChildren)

      assert.deepEqual(vNode.children, vNodeChildren)
    })

    it('converts text to VNodes', () => {
      const vNodeChildren = [ 'hi' ]
      const vNode = h('div', {}, vNodeChildren)

      if (!vNode.children)
        throw new Error(`VNode should have children`)

      assert.deepEqual(vNode.children[0].text, 'hi')
    })
  })

  describe('given a selector, props, and text', () => {
    it('sets the text property', () => {
      const vNode = h('h1', {}, 'Hi')

      assert.strictEqual(vNode.text, 'Hi')
    })
  })

  describe('given a selector, props, and a number', () => {
    it('sets the text property', () => {
      const vNode = h('h1', {}, 4)

      assert.strictEqual(vNode.text, '4')
    })
  })

  describe('given svg tagName', () => {
    it('creates an vNode with SVG namespace', () => {
      const vNode = h('svg')

      assert.ok(vNode.namespace && vNode.namespace.indexOf('svg') > -1)
    })

    it('sets the namespace on children', () => {
      const vNode = h('svg', {}, [ h('g', {}, []) ])

      if (!vNode.children)
        throw new Error(`VNode should have children`)

      const child = vNode.children[0]

      assert.ok(child.namespace && child.namespace.indexOf('svg') > -1)
    })

    it('does not set namespace under a foreignObject', () => {
      const foreignObject = h('foreignObject')
      const child = h('g', {}, [])
      const vNode = h('svg', {}, [ child, foreignObject ])

      Function.prototype(vNode)

      assert.ok(child.namespace && child.namespace.indexOf('svg') > -1)
      assert.ok(!foreignObject.namespace)
    })
  })

  describe('given a scope', () => {
    it('adds scope to children', () => {
      const vNode = h('div', { scope: 'hello' }, [ h('h1', 'Hello') ])

      if (!vNode.children)
        throw new Error(`VNode should have children`)

      assert.strictEqual(vNode.scope, 'hello')
      assert.strictEqual(vNode.children[0].scope, 'hello')
    })

    it('does not overwrite nested scopes', () => {
      const vNode = h('div', { scope: 'hello' }, [ h('h1', { scope: 'other' }, 'Hello') ])

      if (!vNode.children)
        throw new Error(`VNode should have children`)

      assert.strictEqual(vNode.scope, 'hello')
      assert.strictEqual(vNode.children[0].scope, 'other')
    })
  })
})
