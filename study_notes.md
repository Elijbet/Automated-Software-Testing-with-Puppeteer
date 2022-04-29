### Measuring Performance

Analyze how a page performs, during load and runtime - intending to make it faster.

#### Analyzing load time through metrics

Navigation Timing is a Web API that provides information and metrics relating to page navigation and load events, and accessible by window.performance.

```js
// Executes Navigation API within the page context
const metrics = await page.evaluate(() => JSON.stringify(window.performance));

// Parses the result to JSON
console.info(JSON.parse(metrics));
```

Returns a non-serializable value - then evaluate returns eventually undefined. That’s why we stringify window.performance when evaluating within the page context.

The result is transformed into a comfy object:

```js
{
   timeOrigin: 1562785571340.2559,
   timing: {
      navigationStart: 1562785571340,
      unloadEventStart: 0,
      unloadEventEnd: 0,
      redirectStart: 0,
      redirectEnd: 0,
      fetchStart: 1562785571340,
      domainLookupStart: 1562785571347,
      domainLookupEnd: 1562785571348,
      connectStart: 1562785571348,
      connectEnd: 1562785571528,
      secureConnectionStart: 1562785571425,
      requestStart: 1562785571529,
      responseStart: 1562785571607,
      responseEnd: 1562785571608,
      domLoading: 1562785571615,
      domInteractive: 1562785571621,
      domContentLoadedEventStart: 1562785571918,
      domContentLoadedEventEnd: 1562785571926,
      domComplete: 1562785572538,
      loadEventStart: 1562785572538,
      loadEventEnd: 1562785572538
   },
   navigation: {
      type: 0,
      redirectCount: 0
   }
}
```

Now we can combine these metrics and calculate different load times over the loading timeline. For instance, loadEventEnd - navigationStart represents the time since the navigation started until the page is loaded.

#### Analyzing runtime through metrics

```js
// Returns runtime metrics of the page
const metrics = await page.metrics();
console.info(metrics);

// Returns:
{
   Timestamp: 6400.768827, // When the metrics were taken
   Documents: 13, // Number of documents
   Frames: 7, // Number of frames
   JSEventListeners: 33, // Number of events
   Nodes: 51926, // Number of DOM elements
   LayoutCount: 6, // Number of page layouts
   RecalcStyleCount: 13, // Number of page style recalculations
   LayoutDuration: 0.545877, // Total duration of all page layouts
   RecalcStyleDuration: 0.011856, // Total duration of all page style recalculations
   ScriptDuration: 0.064591, // Total duration of JavaScript executions
   TaskDuration: 1.244381, // Total duration of all performed tasks by the browser
   JSHeapUsedSize: 17158776, // Actual memory usage by JavaScript
   JSHeapTotalSize: 33492992 // Total memory usage, including free allocated space, by JavaScript
}
```

JSHeapUsedSize result is actually the output of Performance.getMetrics, which is part of Chrome DevTools Protocol.

#### Analyzing browser activities through tracing

Chromium Tracing is a profiling tool that allows recording what the browser is really doing under the hood - with an emphasis on every thread, tab, and process. And yet, it’s reflected in Chrome DevTools as part of the Timeline panel.

Furthermore, this tracing ability is possible with Puppeteer either - which, as we might guess, practically uses the Chrome DevTools Protocol.

```js
// Starts to record a trace of the operations
await page.tracing.start({ path: "trace.json" });

await page.goto("https://pptr.dev");
await page.waitForSelector("title");

// Stops the recording
await page.tracing.stop();
```

When the recording is stopped, a file called trace.json is created and contains the output that looks like:

```js
{
   "traceEvents":[
      {
         "pid": 21975,
         "tid": 38147,
         "ts": 17376402124,
         "ph": "X",
         "cat": "toplevel",
         "name": "MessageLoop::RunTask",
         "args": {
            "src_file": "../../mojo/public/cpp/system/simple_watcher.cc",
            "src_func": "Notify"
         },
         "dur": 68,
         "tdur": 56,
         "tts": 26330
      },
      // More trace events
   ]
}
```

Now that we’ve the trace file, we can open it using Chrome DevTools, chrome://tracing or Timeline Viewer, and look at the Performance panel after importing the trace file into one of those.

### Puppeteer Waits

#### slowMo

Add pause between every puppeteer action for specific time, basically it slows "time" so you can see better what is going on, it can be useful for debug/development.

#### timeout

How long should puppeteer wait to consider function successful or failed.

#### implicit waits

The latency that you want to see if specified web element is not present that puppeteer looking for. You are telling puppeteer that it should wait x seconds in cases of specified element not available on the UI (DOM): await page.waitForSelector("your-selector") dynamically waits until the selector is visible. Default 30 sec, or pass an options object with a timeout attribute to override that: `await page.waitForSelector(yourSelector, {timeout: 5000});`.

#### explicit waits

Are confined to a particular web element; the max unit of time it is to wait before it gives up: `await page.waitFor(5000)` which always waits for 5 seconds no matter what.
