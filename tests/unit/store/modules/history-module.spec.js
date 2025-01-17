import UndoManager from "undo-manager";
import store from "@/store/modules/history-module";
const { getters, mutations, actions }  = store;

describe( "Vuex history state module", () => {
    const noop = () => {}, AMOUNT_OF_STATES = 5;
    let commit = jest.fn();
    let state;

    beforeEach( () => {
        state = {
            undoManager  : new UndoManager(),
            historyIndex : -1,
            totalSaved   : 0
        };
        state.undoManager.setLimit( AMOUNT_OF_STATES );
    });

    describe( "getters", () => {
        it( "should know when it can undo an action", async () => {
            expect( getters.canUndo( state, { canUndo: state.undoManager.hasUndo() })).toBe( false ); // expected no undo to be available after construction
            mutations.saveState( state, { undo: noop, redo: noop });
            expect( getters.canUndo( state, { canUndo: state.undoManager.hasUndo() })).toBe( true ); // expected undo to be available after addition of action
            await actions.undo({ state, commit, getters: { canUndo: state.undoManager.hasUndo() }});
            expect( getters.canUndo( state, { canUndo: state.undoManager.hasUndo() })).toBe( false ); // expected no undo to be available after having undone all actions
        });

        it( "should know when it can redo an action", async () => {
            expect( getters.canRedo( state )).toBe( false ); // expected no redo to be available after construction
            mutations.saveState(state, { undo: noop, redo: noop });
            expect( getters.canRedo( state )).toBe( false ); // expected no redo to be available after addition of action
            await actions.undo({ state, commit, getters: { canUndo: state.undoManager.hasUndo() }});
            expect( getters.canRedo( state )).toBe( true ); // expected redo to be available after having undone actions
            await actions.redo({ state, commit, getters: { canRedo: state.undoManager.hasRedo() }});
            expect( getters.canRedo( state )).toBe( false ); // expected no redo to be available after having redone all actions
        });

        it( "should know the amount of states it has stored", async () => {
            commit = ( action, value ) => state.historyIndex = value;
            expect( 0 ).toEqual(getters.amountOfStates( state )); // expected no states to be present after construction

            for ( let i = 0; i < AMOUNT_OF_STATES; ++i ) {
                mutations.saveState(state, { undo: noop, redo: noop });
                expect(i + 1).toEqual(getters.amountOfStates( state )); // expected amount of states to increase when storing new states
            }

            for ( let i = AMOUNT_OF_STATES - 1; i >= 0; --i ) {
                await actions.undo({ state, commit, getters: { canUndo: state.undoManager.hasUndo() }});
                expect(i).toEqual(getters.amountOfStates( state )); // expected amount of states to decrease when performing undo
            }

            for ( let i = 0; i < AMOUNT_OF_STATES; ++i ) {
                await actions.redo({ state, commit, getters: { canRedo: state.undoManager.hasRedo() }});
                expect(i + 1).toEqual(getters.amountOfStates( state )); // expected amount of states to increase when performing redo
            }
        });

        it( "should be able to return the total amount of saved states", () => {
            const state = { totalSaved: 10 };
            expect( getters.totalSaved( state )).toEqual( state.totalSaved );
        });
    });

    describe( "mutations", () => {
        it( "should be able to store a state and increment the history index and total saved index", () => {
            mutations.saveState( state, { undo: noop, redo: noop });

            expect( state.historyIndex ).toEqual( 0 );
            expect( state.totalSaved ).toEqual( 1 );

            mutations.saveState(state, { undo: noop, redo: noop });

            expect( state.historyIndex ).toEqual( 1 );
            expect( state.totalSaved ).toEqual( 2 );
        });

        it( "should not store more states than are allowed but allow incrementing the total saved beyond the available hsitory size", () => {
            const AMOUNT_TO_ADD = AMOUNT_OF_STATES * 2;
            for ( let i = 0; i < AMOUNT_TO_ADD; ++i ) {
                mutations.saveState( state, { undo: noop, redo: noop });
            }
            expect( getters.amountOfStates( state )).toEqual( AMOUNT_OF_STATES ); // expected model to not have recorded more states than the defined maximum
            expect( state.totalSaved ).toEqual( AMOUNT_TO_ADD ); // but the total amount saved to have incremented
        });

        it( "should be able to set the history index", () => {
            mutations.setHistoryIndex( state, 2 );
            expect( state.historyIndex ).toEqual( 2 );
        });

        it( "should be able to clear its history", () => {
            function shouldntRun() {
                throw new Error( "undo/redo callback should not have fired after clearing the undo history" );
            }
            mutations.saveState( state, { undo: shouldntRun, redo: shouldntRun });
            mutations.saveState( state, { undo: shouldntRun, redo: shouldntRun });

            mutations.resetHistory( state );

            expect( state.historyIndex).toEqual( -1 );
            expect( getters.canUndo( state )).toBe( false ); // expected no undo to be available after flushing of history
            expect( getters.canRedo( state )).toBe( false ); // expected no redo to be available after flushing of history
            expect( 0 ).toEqual( getters.amountOfStates( state )); // expected no states to be present in history
            expect( 0 ).toEqual( state.totalSaved ); // expected the total amount saved to have reset
        });
    });

    describe( "actions", () => {
        it( "should be able to redo an action", async () => {
            commit = jest.fn();
            const redo = jest.fn();
            mutations.saveState(state, { undo: noop, redo: redo });

            await actions.undo({ state, commit, getters: { canUndo: state.undoManager.hasUndo() }});
            expect(commit).toHaveBeenNthCalledWith(1, "setHistoryIndex", -1);
            await actions.redo({ state, commit, getters: { canRedo: state.undoManager.hasRedo() }});

            expect(redo).toHaveBeenCalled();
            expect(commit).toHaveBeenNthCalledWith(2, "setHistoryIndex", 0);
        });

        it( "should be able to undo an action when an action was stored in its state history", async () => {
            const undo = jest.fn();
            mutations.saveState(state, { undo: undo, redo: noop });

            await actions.undo({ state, commit, getters: { canUndo: state.undoManager.hasUndo() }});

            expect(undo).toHaveBeenCalled();
            expect(state.historyIndex).toEqual(0);
        });
    });
});
