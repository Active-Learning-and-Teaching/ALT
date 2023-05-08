// typography.js

import React from 'react'
import { Text, Platform, StyleSheet } from 'react-native'

export const typography = () => {
  const oldTextRender = Text.render
  Text.render = function(...args) {
    const origin = oldTextRender.call(this, ...args)
    return React.cloneElement(origin, {
      style: [styles.defaultText, origin.props.style],
    })
  }
}

const styles = StyleSheet.create({
  defaultText: {
    ...Platform.select({
      ios: {
        fontFamily : 'System',
        color:'black',
      },
      android: {
        fontFamily : 'System',
        color:'black',
      }}),
 }
});