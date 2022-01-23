/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2017-2022 - https://www.igorski.nl
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
import Vue         from "vue";
import Config      from "@/config";
import StorageUtil from "@/utils/storage-util";

export const PROPERTIES = {
    INPUT_FORMAT    : "if",
    FOLLOW_PLAYBACK : "fp",
    DISPLAY_HELP    : "dh",
    DISPLAY_WELCOME : "dw",
    TIMELINE_MODE   : "tl",
};

/* internal methods */

/**
 * save the state of the model in local storage
 */
const persistState = state => {
    StorageUtil.setItem( Config.LOCAL_STORAGE_SETTINGS, JSON.stringify( state._settings ));
};

// a module that can store user defined settings
// and retrieve them in future sessions

export default {
    state: {
        _settings: {},
    },
    getters: {
        displayHelp    : state => state._settings[ PROPERTIES.DISPLAY_HELP ] !== false,
        displayWelcome : state => state._settings[ PROPERTIES.DISPLAY_WELCOME ] !== false,
        followPlayback : state => state._settings[ PROPERTIES.FOLLOW_PLAYBACK ] === true,
        timelineMode   : state => state._settings[ PROPERTIES.TIMELINE_MODE ] === true,
        paramFormat    : state => state._settings[ PROPERTIES.INPUT_FORMAT ] || "hex"
    },
    mutations: {
        saveSetting( state, { name, value }) {
            Vue.set( state._settings, name, value );
            persistState( state );
        },
        setStoredSettings( state, settings ) {
            state._settings = settings;
        }
    },
    actions: {
        async loadStoredSettings({ commit }) {
            StorageUtil.init();
            try {
                const result = await StorageUtil.getItem( Config.LOCAL_STORAGE_SETTINGS );
                if ( typeof result === "string" ) {
                    try {
                        commit( "setStoredSettings", JSON.parse( result ));
                    } catch {
                        // that's fine (non-blocking)
                    }
                }
            } catch {
                // no settings available yet, that is fine (non-blocking)
            }
        },
    }
};
