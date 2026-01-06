export function loadMonaco() {
    return new Promise((resolve, reject) => {
        if (window.monaco) {
            resolve(window.monaco);
            return;
        }

        const script = document.createElement('script');
        script.src = 'libs/loader.min.js';
        script.onload = () => {
            require.config({ paths: { 'vs': 'libs/vs' }});
            require(['vs/editor/editor.main'], (monaco) => {
                window.monaco = monaco;
                resolve(monaco);
            }, reject);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}
