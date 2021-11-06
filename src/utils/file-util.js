/**
* The MIT License (MIT)
*
* Igor Zinken 2019-2021 - https://www.igorski.nl
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
import { ACCEPTED_FILE_TYPES, PROJECT_FILE_EXTENSION } from "@/definitions/file-types";
import { blobToResource, disposeResource } from "@/utils/resource-manager";

/**
 * Save given data as a file on disk. When working with Blob URLs
 * you can revoke these immediately after this invocation to free resources.
 *
 * @param {Blob|String} data as String, can be inlined data: content or Blob URL
 *                      can also be Blob
 * @param {String} fileName name of file
 */
export const saveAsFile = ( data, fileName ) => {
    const isBlob = data instanceof Blob;
    if ( isBlob ) {
        data = blobToResource( data );
    }
    const anchor  = document.createElement( "a" );
    anchor.style.display = "none";
    anchor.href = data;
    anchor.setAttribute( "download", fileName );

    // Safari has no download attribute
    if ( typeof anchor.download === "undefined" ) {
        anchor.setAttribute( "target", "_blank" );
    }
    document.body.appendChild( anchor );
    anchor.click();
    document.body.removeChild( anchor );

    if ( isBlob ) {
        disposeResource( data );
    }
};

export const readFile = ( file, optEncoding = "UTF-8" ) => {
    const reader = new FileReader();
    return new Promise(( resolve, reject ) => {
        reader.onload = readerEvent => {
            resolve( readerEvent.target.result );
        };
        reader.onerror = reject;
        reader.readAsText( file, optEncoding );
    });
};

export const openFileBrowser = ( handler, acceptedFileTypes ) => {
    const fileBrowser = document.createElement( "input" );
    fileBrowser.setAttribute( "type", "file");
    if ( Array.isArray( acceptedFileTypes )) {
        fileBrowser.setAttribute( "accept", acceptedFileTypes );
    }
    const simulatedEvent = document.createEvent( "MouseEvent" );
    simulatedEvent.initMouseEvent(
        "click", true, true, window, 1,
         0, 0, 0, 0, false,
         false, false, false, 0, null
    );
    fileBrowser.dispatchEvent( simulatedEvent );
    fileBrowser.addEventListener( "change", handler );
};

export const readDroppedFiles = dataTransfer => {
    const items = [ ...( dataTransfer?.files || []) ];
    return {
        sounds   : items.filter( isSoundFile ),
        projects : items.filter( isProjectFile )
    }
};

/* internal methods */

function isSoundFile( item ) {
    return ACCEPTED_FILE_TYPES.includes( item.type );
}

function isProjectFile( file ) {
    const [ , ext ] = file.name.split( "." );
    return `.${ext}` === PROJECT_FILE_EXTENSION;
}
