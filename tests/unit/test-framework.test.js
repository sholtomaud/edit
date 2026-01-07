it('assertEqual should pass for equal primitives', () => {
    assertEqual(1, 1);
    assertEqual('a', 'a');
    assertEqual(true, true);
});

it('assertEqual should throw for unequal primitives', () => {
    let thrown = false;
    try {
        assertEqual(1, 2);
    } catch (e) {
        thrown = true;
    }
    assertTrue(thrown);
});

it('assertDeepEqual should pass for equal objects', () => {
    assertDeepEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}});
});

it('assertDeepEqual should throw for unequal objects', () => {
    let thrown = false;
    try {
        assertDeepEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 3}});
    } catch (e) {
        thrown = true;
    }
    assertTrue(thrown);
});
