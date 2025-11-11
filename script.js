const htmlCode = document.getElementById('html-code');
        const cssCode = document.getElementById('css-code');
        const jsCode = document.getElementById('js-code');
        const previewFrame = document.getElementById('preview-frame');
        const themeToggle = document.getElementById('theme-toggle');

        let timeout;
        let actionTimeout;
        let blinkInterval;

        // Theme toggle with proper error handling
        let savedTheme = 'light';
        try {
            savedTheme = localStorage.getItem('theme') || 'light';
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
        document.documentElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            try {
                localStorage.setItem('theme', newTheme);
            } catch (e) {
                console.warn('Could not save theme:', e);
            }
        });

        

        // Auto-update preview with debouncing
        let isTyping = false;
        let typingTimer;

        [htmlCode, cssCode, jsCode].forEach(editor => {
            editor.addEventListener('input', () => {
                if (!isTyping) {
                    isTyping = true;
                }

                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    isTyping = false;
                }, 800);

                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    runCode();
                }, 1000);
            });
        });

        function runCode() {
            try {
                const html = htmlCode.value;
                const css = `<style>${cssCode.value}</style>`;
                const js = `<script>${jsCode.value.replace(/<\/script>/gi, '<\\/script>')}<\/script>`;
                previewFrame.srcdoc = html + css + js;
            } catch (e) {
                console.error('Error running code:', e);
            }
        }

        // Initial load
        setTimeout(() => {
        }, 500);

        runCode();

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (blinkInterval) {
                clearInterval(blinkInterval);
            }
            clearTimeout(timeout);
            clearTimeout(actionTimeout);
            clearTimeout(typingTimer);
        });