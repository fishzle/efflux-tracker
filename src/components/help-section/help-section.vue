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
<template>
    <section class="help-section">
        <div class="help-section__content">
            <!-- topic "general" -->
            <template v-if="helpTopic === 'general'">
                <h4>Efflux help</h4>
                <p>
                    Welcome to Efflux. A compositional tool that allows you to create music inside your web browser.
                    Efflux provides you with up to eight synthesizer modules, allowing you to create your own custom
                    sounds, driven by a tracker interface.
                </p>
                <p>
                    Contextual help is offered for all different aspects of the tracker. If you wish to read a more
                    in-depth manual for a quick start, consult the <a href="https://www.igorski.nl/efflux/help" rel="noopener" target="_blank">online manual</a>.
                </p>
                <p>
                    Efflux is under continuous development, open for suggestions and also fully
                    <a href="https://www.github.com/igorski/efflux-tracker" rel="noopener" target="_blank">open source</a>.
                </p>
            </template>
            <!-- topic "menu" -->
            <template v-if="helpTopic === 'menu'">
                <h4>Song save</h4>
                <p>
                    You can save your work allowing you to continue at a later date. Songs are either saved in your browsers local storage
                    <i>(making them available only to the browser they were saved in)</i> or alternatively stored in your Dropbox account, making
                    it accessible on all the devices you have linked to your Dropbox (storing it in a shared folder also allows you to
                    more easily collaborate with a friend).
                </p>
                <h4>Import / export</h4>
                <p>
                    You can also export your song to a file which can then be imported in another browser. You can for instance start
                    a song on your Android phone, export the song and import it on your desktop computer to continue your work on
                    a larger screen.
                </p>
                <p>
                    Additionally, you can export your song as MIDI, which can be imported in a DAW for further
                    production or used to control hardware instruments.
                </p>
                <h4>Output recording</h4>
                <p>
                    You can also record the live output of Efflux as a WAV file. By selecting this option, the recording of
                    the audio output is enabled <i>(recording will start immediately if the sequencer was playing, or will start as soon
                    as the sequencer is started)</i>.
                </p>
                <p>
                    Once the sequencer is stopped, the recording will be saved and downloaded onto your device.
                </p>
            </template>
            <!-- topic "pattern" -->
            <template v-if="helpTopic === 'pattern'">
                <h4>Pattern properties</h4>
                <p>
                    Your composition may contain up to 255 patterns. To speed up proceedings, you can
                    copy a pattern (this copies both channels), and paste them into another pattern (pasting does
                    not clear existing pattern content, only overwrite overlapping notes).
                </p>
                <p>
                    When adding a pattern, it is inserted after the currently active pattern. As such it is possible
                    to add patterns in between existing parts of your composition.
                </p>
                <p>
                    Patterns can have a 16- to 128-step precision. You can switch between these on an individual pattern
                    basis. 16 steps are great for sketching rhythmic accents while 64 steps are good for creating arpeggios to
                    imply chord outlines.
                </p>
            </template>
            <!-- topic "tracker" -->
            <template v-if="helpTopic === 'tracker'">
                <h4>Tracker help</h4>
                <p>
                    For speedy editing, it is recommended to use the keyboard while creating your patterns. You can use the arrow
                    keys to switch pattern and channel positions and while you can use <strong>ENTER</strong> to open the parameter automation editor,
                    and <strong>ctrl + ENTER</strong> to open the note entry editor, it is recommended you invest in getting to know the shortcuts
                    for speedy editing!
                </p>
                <p>
                    For one, you can play notes instantly by using the following keyboard keys:<br /><br />
                    <strong>&nbsp;S D   G H J   L ;<br />
                    Z X C V B N M , . /</strong><br /><br />
                    ...which mimic the layout of a 1.5 octave piano keyboard. You can adjust the root octave by using the <strong>[</strong> and <strong>]</strong> keys.
                    By either clicking the record button in the transport controls or by using <strong>ctrl + R</strong> to toggle the recording mode, you can add the notes directly into the currently selected pattern.
                </p>
                <p>
                    The <strong>K</strong>-key inserts an "off"-instruction (kills previously playing note) while hitting <strong>SPACEBAR</strong> toggles the play state of the sequencer.
                </p>
                <p>
                    By using the left and right arrow keys you can move between note entry, instrument selection, module automation and module
                    automation values. You can use the numeric and character keys to change the values (see <a href="https://www.igorski.nl/efflux/help/patterns" rel="noopener" target="_blank">online manual</a>).
                </p>
                <h4>Selections and copy / paste</h4>
                <p>
                    If you hold down <strong>shift</strong> while using the arrow keys (or mouse), you can make a selection. To copy a selection,
                    press <strong>ctrl + C</strong>, press <strong>ctrl + V</strong> to paste and <strong>ctrl + X</strong> to cut selections. You can paste
                    selections across the available channels.
                </p>
                <h4>Undo / redo</h4>
                <p>
                    Efflux stores 99 states in its internal history. You can use <strong>ctrl + Z</strong> to undo and
                    <strong>ctrl + shift + Z</strong> to redo a state.
                </p>
                <p>
                    For more in-depth help you can consult the <a href="https://www.igorski.nl/efflux/help/patterns" rel="noopener" target="_blank">pattern page</a>
                    in the online manual.
                </p>
            </template>
            <template v-if="helpTopic === 'note-entry'">
                <h4>Note entry</h4>
                <p>
                    There you go, a mini piano to directly play (and hear!) the instruments. By selecting a channel in the pattern list, you are selecting
                    the corresponding instrument for playback.
                </p>
                <p>
                    By toggling the sequencers recording status, you can record a note directly into
                    the pattern list, also while the sequencer is running.
                </p>
                <p>
                    Note : this on-screen keyboard is aimed towards touch screen devices. You can have different workflows
                    using your computers keyboard or attached MIDI controllers for note input.
                </p>
                <p>
                    For one, you can play notes instantly by using the following keyboard keys:<br /><br />
                    <strong>&nbsp;2 3   5 6 7   9 0<br />
                    Q W E R T Y U I O P</strong><br /><br />
                    ...which mimic the layout of a 1.5 octave piano keyboard. You can adjust the root octave by using the <strong>-</strong> and <strong>+</strong> keys.
                </p>
                <p>
                    For more in-depth help on this topic you can consult the <a href="https://www.igorski.nl/efflux/help/note-input" rel="noopener" target="_blank">note input</a> page in the online manual.
                </p>
            </template>
        </div>
    </section>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: {
        ...mapState([
            "helpTopic"
        ])
    },
};
</script>

<style lang="scss" scoped>
@use "@/styles/_mixins";
@use "@/styles/_variables";

.help-section {
    @include mixins.editorComponent();
    border-right: none;
    border-bottom: none;
    border-radius: 0;
    vertical-align: top;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;

    @media screen and (max-width: variables.$app-width ) {
        display: none;
        width: 0;
    }

    &__content {
        padding: variables.$spacing-small variables.$spacing-medium 0;
        line-height: 2;
    }

    h4 {
        color: #FFF;
        margin: 0;
        font-size: 110%;
    }

    strong {
        color: #FFF;
        font-style: italic;
    }
}
</style>
