# Example using Pixi.js + Ngraph layout in web worker

## Motivation
When using Pixi.js to render an Ngraph layout, its convenient to place the layout functions within the render loop so that each animation step updates the layout. As more load is placed on the render loop (such as more advanced graphics), framerates can drop. Even if the rendering speed is sufficient for smooth visuals, it can delay resolution of the force layout. Because the layout is called once per render loop, it takes longer to resolve the layout and can seem sluggish even with Ngraph's fast layout algorithms. Further, including the layout function within the render loop may also drive the framerate down slightly as it adds to the work load on the render thread.

## Solution
### Web Workers
Using web workers we can place the layout loops on a different thread from the render loop. This allows the layout to run independently and can achieve much faster resolution times. 

`webworkify` is used to include the web worker code with `browserify`

### Skipping Messages
In order to reduce overhead of sending messages between the threads, we can also skip sending messages at every step of the layout loop. The number of skipped messages can be edited by changing the `_layoutStepsPerMessage` field.

### Smoothing
One side-effect of separating the 2 loops (and skipping messages) is that the render loop will only render every Nth frame of the layout loop. This can make things look a bit chaotic if you render the positions directly. We can create a more pleasant visual experience by smoothing the movement of the nodes.

# Further Optimizations
This example uses an older version of Pixi.js and uses the graphics API to render shapes which is much slower than rendering using Sprites and ParticleContainer. For this example, its actually preferable to have a slower render rate to illustrate the difference this approach can make to layout resolution times. However, for real world use, one would look to optimize the Pixi.js render code. 

It also appears that the render time is not completely independent from the layout loop even using a web worker. Both seem to slow down as the render load on the browser increases, but there are still significant gains to putting the layout on its own thread.  

# Examples
Live examples courtesy of anvaka:
* https://anvaka.github.io/pixi-ngraph/index.html - layout inside web workers (this solution)
* https://anvaka.github.io/pixi-ngraph/index-plain.html - this version computes layout inside requestAnimationFrame()

The web worker resolves approximately 8 times faster.

# How to run examples locally?
Powered by `npm` and `gulp`.  Dist folder can be generated using `npm start`. Make sure you have all modules installed inside a folder (`npm install` inside folder with example will download all dependencies). 
