/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2022 - https://www.igorski.nl
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
    <div class="optimization-window">
        <div class="header">
            <h2 v-t="'title'"></h2>
            <button
                type="button"
                class="close-button"
                @click="close()"
            >x</button>
        </div>
        <hr class="divider" />
        <div class="content">
            <p v-t="'optimizeExpl'"></p>
            <button
                v-t="'optimize'"
                type="button"
                class="button confirm-button"
                @click="optimize()"
            ></button>
        </div>
        <hr class="divider" />
        <div class="footer"></div>
    </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations } from "vuex";
import OscillatorTypes from "@/definitions/oscillator-types";
import { ACTION_NOTE_OFF, ACTION_AUTO_ONLY } from "@/model/types/audio-event";
import type { EffluxChannel } from "@/model/types/channel";
import type { InstrumentOscillator, EffluxInstrument } from "@/model/types/instrument";
import type { Sample } from "@/model/types/sample";
import EventUtil from "@/utils/event-util";

import messages from "./messages.json";

export default {
    emits: [ "close" ],
    i18n: { messages },
    computed: {
        ...mapGetters([
            "activeSong",
            "samples",
        ]),
    },
    methods: {
        ...mapMutations([
            "openDialog",
            "removeSample",
            "removeSampleFromCache",
        ]),
        optimize(): void {
            let cleanedTables = 0;
            let cleanedSamples = 0;
            let cleanedInstructions = 0;

            const seenSamples: Sample = [];

            // clean up unused custom wave tables
            this.activeSong.instruments.forEach(( instrument: EffluxInstrument ) => {
                instrument.oscillators.forEach(( oscillator: InstrumentOscillator ) => {
                    if ( oscillator.table && oscillator.waveform !== OscillatorTypes.CUSTOM ) {
                        oscillator.table = 0;
                        ++cleanedTables;
                    }
                    if ( oscillator.waveform === OscillatorTypes.SAMPLE ) {
                        const sample = this.samples.find(({ name }) => name === oscillator.sample );
                        if ( sample ) {
                            seenSamples.push( sample.id );
                        }
                    }
                });
            });

            // clean up unused samples
            this.samples.forEach(( sample: Sample ) => {
                if ( !seenSamples.includes( sample.id )) {
                    this.removeSampleFromCache( sample );
                    this.removeSample( sample );
                    ++cleanedSamples;
                }
            });

            // remove useless instructions
            const lastEvents = new Array( this.activeSong.patterns.length );
            this.activeSong.order.forEach(( patternIndex: number /* , orderIndex: number */ ) => {
                this.activeSong.patterns[ patternIndex ].channels.forEach(( channel: EffluxChannel, channelIndex: number ) => {
                    channel.forEach(( event, index ) => {
                        if ( !event ) {
                            return;
                        }
                        let clear = false;
                        const lastEvent = lastEvents[ channelIndex ];

                        // remove double note offs
                        if ( event.action === ACTION_NOTE_OFF && lastEvent?.action === ACTION_NOTE_OFF ) {
                            clear = true;
                        }

                        // remove non-op duplicate automations
                        if ( event.action === ACTION_AUTO_ONLY && lastEvent?.action === ACTION_AUTO_ONLY && !!event.mp && !!lastEvent.mp ) {
                            if ( event.mp.module === lastEvent.mp.module &&
                                 event.mp.value  === lastEvent.mp.value ) {
                                clear = true;
                            }
                        }

                        if ( clear ) {
                            EventUtil.clearEvent( this.activeSong, patternIndex, channelIndex, index );
                            ++cleanedInstructions;
                        }
                        lastEvents[ channelIndex ] = event;
                    });
                });
            });

            this.openDialog({
                title: this.$t( "optimizationComplete" ),
                message : this.$t( "removedUnused", { waveTables: cleanedTables, samples: cleanedSamples, instructions: cleanedInstructions })
            });
            this.close();
        },
        close() {
            this.$emit( "close" );
        }
    }
};
</script>

<style lang="scss" scoped>
@use "sass:math";

@use "@/styles/_mixins";
@use "@/styles/_variables";
@use "@/styles/transporter";

$width: 450px;
$height: 290px;

.optimization-window {
    @include mixins.editorComponent();
    @include mixins.overlay();
    padding: variables.$spacing-small variables.$spacing-large;

    .divider {
        width: calc(100% + #{variables.$spacing-large * 2});
        margin-left: -( variables.$spacing-large );
        margin-bottom: variables.$spacing-medium;
    }

    @include mixins.componentIdeal( $width, $height ) {
        width: $width;
        height: $height;
        top: 50%;
        left: 50%;
        margin-left: math.div( -$width, 2 );
        margin-top: math.div( -$height, 2 );
    }

    @include mixins.componentFallback( $width, $height ) {
        @include mixins.verticalScrollOnMobile();
    }

    .confirm-button {
        width: 100%;
        padding: variables.$spacing-medium variables.$spacing-large;
    }
}
</style>
