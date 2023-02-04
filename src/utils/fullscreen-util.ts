/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2017-2020 - https://www.igorski.nl
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import Bowser from "bowser";

const d = window.document;
let fsToggle: Element;
let fsCallback: () => void;

export const isSupported = (): boolean => Bowser.getParser( window.navigator.userAgent ).getOSName( true ) !== "ios";

export const setToggleButton = ( element: Element, callback: () => void ): void => {
    fsToggle = element;
    fsToggle.addEventListener( "click", toggleFullscreen );

    fsCallback = callback;

    [
        "webkitfullscreenchange", "mozfullscreenchange", "fullscreenchange", "MSFullscreenChange"
    ]
    .forEach( event => d.addEventListener( event, handleFullscreenChange, false ));
};

/* internal methods */

function toggleFullscreen(): void {
    let requestMethod, element;
    // @ts-expect-error vendor prefixed fallbacks not declared in spec
    if ( d.fullscreenElement || d.webkitFullscreenElement ) {
        // @ts-expect-error vendor prefixed fallbacks not declared in spec
        requestMethod = d.exitFullscreen || d.webkitExitFullscreen || d.mozCancelFullScreen || d.msExitFullscreen;
        element = d;
    } else {
        // @ts-expect-error vendor prefixed fallbacks not declared in spec
        requestMethod = d.body.requestFullScreen || d.body.webkitRequestFullScreen || d.body.mozRequestFullScreen || d.body.msRequestFullscreen;
        element = d.body;
    }
    if ( requestMethod ) {
        requestMethod.call( element );
    }
}

function handleFullscreenChange(): void {
    // @ts-expect-error vendor prefixed fallbacks not declared in spec
    fsCallback( document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement === true );
}
