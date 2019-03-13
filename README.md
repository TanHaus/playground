Web apps (https://gau-nernst.github.io/Web-apps/)
==================

<img src="https://img.shields.io/github/repo-size/gau-nernst/Web-apps.svg">
<img src="https://img.shields.io/github/languages/top/gau-nernst/Web-apps.svg">
<img src="https://img.shields.io/github/license/gau-nernst/Web-apps.svg">

I write small applications that run directly in web browsers. Most of them are simple physics simulations and topics that I am intersted in.

This site is written in HTML, CSS and JavaScript.

# List of apps

- Simple balls (Not working)
- Planets (Not working)
- Pendulum
- Double pendulum
- Graphing
- Fractals
- Lissajous curves
- Harmonic oscillator
- Wave (under development)
- Taylor series (under development)
- Fourier series (under development)

# Mathematical expressions

All mathematical expressions are written in LaTeX and rendered with [KaTeX](https://github.com/KaTeX/KaTeX). A small script is written to render inline mathematical expressions, which are encapsulated by a `<span>` block with class `"math"`.

The inline math render script is located in `/libraries/inlineKatex.js`.

# math.js

This is a math library I write for my own use. All of the math functions used in my web apps are written in this math.js library.

math.js is located in `/libraries/math.js`.

## Classes

### ComplexNumber

- constructor(re,im):
    - re: Real part of the Complex number
    - im: Imaginary part of the Complex number
    - return: a ComplexNumber object
- Instance methods:
    - toString():
        - return: a+bi
    - clone(other):
        - description: copy value 
        - other: a ComplexNumber object
        - return: 
- Static methods:

### Polynomial

## Namespaces

### Calculus

### Graph

### Signal

