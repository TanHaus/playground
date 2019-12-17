TanHaus' Playground! (https://tanhaus.github.io/playground/)
==================

# Description

Welcome to the TanHaus' Playground! This is where the Tans experiment and try out new ideas. It is a collection of web applets and small applications.

# Web applets

<h2>Featured</h2>
<ul>
    <li><a href="double-pendulum/">Double pendulum</a></li>
    <li><a href="oscillator/">Harmonic oscillator</a></li>
</ul>
<h2>Under development</h2>
<ul>
    <li><a href="fractals/">Fractals</a></li>
    <li><a href="lissajous/">Lissajous curves</a></li>
    <li><a href="pendulum/">Pendulum</a></li>
    <li><a href="graphing/">Graphing</a></li>                
    <li><a href="wave/">Wave</a></li>
    <li><a href="taylor-series/">Taylor series</a></li>
    <li><a href="fourier-series/">Fourier series</a></li>
    <li><a href="sort/">Sort algorithm visualization</a></li>
    <li><a href="stokcs/">Stocks</a></li>
    <li><a href="eqn-solver/">Equation solver</a></li>
    <li><a href="slits/">Slits</a></li>
</ul>

## Mathematical expressions

All mathematical expressions are written in LaTeX and rendered with [KaTeX](https://github.com/KaTeX/KaTeX). A small script is written to render inline mathematical expressions, which are encapsulated by a single dollar sign symbol `$`.

To accomodate the responsive design, I only uses inline LaTeX. This is a problem with KaTeX, where block math expressions will not wrap properly.

The inline math render script is located in `/libraries/inlineKatex.js`.

## Structure

Each web app should have one explanation page accompanied it. Currently, only the featured ones have explanation pages.

Both the app page and the explanation page have responsive design. Meaning, they should be displayed well on both mobile and desktop devices.

# math.js

There is a special math library named `math.js` located in `\libraries\math.js`. This script contains all the math functions that I use in my code. Feel free to download this script for your own personal use. Documentation is available in the [Wiki](https://github.com/gau-nernst/web-apps/wiki/math.js) section (WIP).
