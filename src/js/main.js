/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2016 - http://www.igorski.nl
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
var SongModel          = require( "./model/SongModel" );
var KeyboardController = require( "./controller/KeyboardController" );
var MenuController     = require( "./controller/MenuController" );
var MetaController     = require( "./controller/MetaController" );
var PatternController  = require( "./controller/PatternController" );

/* initialize */

(function( ref )
{
    // prepare application model

    var slocum = ref.slocum =
    {
        _models : {
            SongModel : new SongModel()
        }
    };

    // create new empty song

    slocum.activeSong = slocum._models.SongModel.createSong();

    // initialize application controllers

    var container = document.querySelector( "#application" );

    MenuController.init();
    KeyboardController.init( slocum );
    MetaController.init( container, slocum, KeyboardController );
    PatternController.init( container, slocum, KeyboardController );

})( self );
