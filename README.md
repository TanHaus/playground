Web apps (https://gau-nernst.github.io/Web-apps/)
==================

<img src="https://img.shields.io/github/repo-size/gau-nernst/Web-apps.svg">
<img src="https://img.shields.io/github/languages/top/gau-nernst/Web-apps.svg">
<img src="https://img.shields.io/github/license/gau-nernst/Web-apps.svg">

I write small applications that run directly in web browsers. Most of them are simple physics simulations and topics that I am intersted in.

This site is written in HTML, CSS and JavaScript.

# List of apps

<ul>
    <li>Simple balls (Not working)</li>
    <li>Planets (Not working)</li>
    <li><a href="https://gau-nernst.github.io/Web-apps/pendulum/">Pendulum</a></li>
    <li><a href="https://gau-nernst.github.io/Web-apps/double-pendulum/">Double pendulum</a></li>
    <li><a href="https://gau-nernst.github.io/Web-apps/graphing/">Graphing</a></li>
    <li><a href="https://gau-nernst.github.io/Web-apps/fractals/">Fractals</a></li>
    <li><a href="https://gau-nernst.github.io/Web-apps/lissajous/">Lissajous curves</a></li>
    <li><a href="https://gau-nernst.github.io/Web-apps/oscillator/">Harmonic oscillator</a></li>
    <li><a href="https://gau-nernst.github.io/Web-apps/wave/">Wave (under development)</a></li>
    <li><a href="https://gau-nernst.github.io/Web-apps/taylor-series/">Taylor series (under development)</a></li>
    <li><a href="https://gau-nernst.github.io/Web-apps/fourier-series/">Fourier series (under development)</a></li>
    <li><a href="https://gau-nernst.github.io/Web-apps/sort/">Sort algorithm visualization (under development)</a></li>
</ul>

# Mathematical expressions

All mathematical expressions are written in LaTeX and rendered with [KaTeX](https://github.com/KaTeX/KaTeX). A small script is written to render inline mathematical expressions, which are encapsulated by a `<span>` block with class `"math"`.

The inline math render script is located in `/libraries/inlineKatex.js`.

# Main features

## Implemented

- Extensive use of HTML5 Canvas API
- Correct scaling for canvas elements on high DPI displays (e.g. mobile phones)

## Ideas

- Use of REST API (e.g. maps)
- OAuth2 token

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

