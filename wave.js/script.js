var canvas, width, height, ctx, map = [], mp = 16, freespace;
        function onload() {
            freeheight = window.innerHeight - parseInt(document.defaultView.getComputedStyle(document.getElementsByTagName('div')[0]).height)
            canvas = document.getElementsByTagName('canvas')[0];
            canvas.width = window.innerWidth - (window.innerWidth * 0.25);
            canvas.height = freeheight - (freeheight * 0.1);
            width = parseInt(canvas.width / mp);
            height = parseInt(canvas.height / mp);
            ctx = canvas.getContext('2d');

            setup();
            setInterval(tick, 66);
        }

        function xyToIndex(h, x, y) {
            return y * h + x;
        }

        function drawMap(ctx, map) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (y = 0; y < height; y++) {
                for (x = 0; x < width; x++) {
                    const i = xyToIndex(width, x, y);
                    ctx.fillStyle = `rgb(${(map[i] ** (4 + (map[i] * 0.5))) * Math.cos(map[i]) * 255}, ${(map[i] ** (3 + (map[i] * 0.5))) * Math.sin(map[i]) * 255}, ${(map[i] ** (2 + (map[i] * 0.5))) * 255})`;
                    ctx.fillRect(x * mp + (1 - map[i] * 0.95) / 2, y * mp + (1 - map[i] * 0.95) / 2, mp * map[i] * 0.95, mp * map[i] * 0.95);
                }
            }
        }

        function setup() {
            map = new Array(width * height);
            for (y = 0; y < height; y++) {
                for (x = 0; x < width; x++) {
                    const i = xyToIndex(width, x, y);
                    map[i] = Math.random();
                }
            }
        }

        function tick() {
            let lastMap = map;
            map = new Array(width * height);

            for (y = 0; y < height; y++) {
                for (x = 0; x < width; x++) {
                    const i = xyToIndex(width, x, y);
                    const lastValue = lastMap[i];

                    map[i] = lastValue * (0.96 + 0.02 * Math.random());

                    if (lastValue <= (0.18 + 0.04 * Math.random())) {
                        let n = 0;

                        for (u = -1; u <= 1; u++) {
                            for (v = -1; v <= 1; v++) {
                                if (u == 0 && v == 0) {
                                    continue;
                                }

                                let nX = Math.abs((x + u) % width);
                                let nY = Math.abs((y + v) % height);

                                const nI = xyToIndex(width, nX, nY);
                                const nLastValue = lastMap[nI];

                                if (nLastValue >= (0.5 + 0.04 * Math.random())) {
                                    n += 1;
                                    map[i] += nLastValue * (0.8 + 0.4 * Math.random());
                                }
                            }
                        }

                        if (n > 0) {
                            map[i] *= 1 / n;
                        }

                        if (map[i] > 1)
                            map[i] = 1;
                    }
                }
            }
            drawMap(ctx, map);
        }