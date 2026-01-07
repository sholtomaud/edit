function it(description, body_of_test) {
  const result = document.createElement('p');
  result.classList.add('test_result')

  try {
    body_of_test();
    result.classList.add('success');
    result.innerHTML = description;
  } catch (error) {
    result.classList.add('failure');
    result.innerHTML = `${description}<br/><pre>${error}</pre>`;
  }

  document.body.appendChild(result);
}

function assertEqual(x, y) {
  if (x === y) {
    return;
  } else {
    throw new Error(`${JSON.stringify(x)} != ${JSON.stringify(y)}`);
  }
}

function assertNotEqual(x, y) {
    if (x !== y) {
        return;
    } else {
        throw new Error(`${JSON.stringify(x)} == ${JSON.stringify(y)}`);
    }
}

function assertDeepEqual(x, y) {
    if (x === y) {
        return;
    }

    if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) {
        throw new Error(`Expected ${JSON.stringify(x)} to deeply equal ${JSON.stringify(y)}`);
    }

    const keysX = Object.keys(x);
    const keysY = Object.keys(y);

    if (keysX.length !== keysY.length) {
        throw new Error(`Expected ${JSON.stringify(x)} to deeply equal ${JSON.stringify(y)}`);
    }

    for (const key of keysX) {
        if (!keysY.includes(key)) {
            throw new Error(`Expected ${JSON.stringify(x)} to deeply equal ${JSON.stringify(y)}`);
        }
        assertDeepEqual(x[key], y[key]);
    }
}

function assertTrue(x) {
  assertEqual(x, true);
}

function assertFalse(x) {
  assertEqual(x, false);
}
