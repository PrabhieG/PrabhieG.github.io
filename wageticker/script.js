const counter = document.getElementById('money'),
                 hour = document.getElementById('hour'),
                  min = document.getElementById('minute'),
                  sec = document.getElementById('seconds'),
                 time = document.getElementById('time'),
                  ttd = document.getElementById('ttd'),
                  ttt = document.getElementById('ttt'),
                  tth = document.getElementById('tth');
        const start = new Date();
        let diff; 
        let hourly = 0, 
          minutely = 0, 
          secondly = 0, 
          ttdollar = 0, 
             ttten = 0, 
         tthundred = 0;

        hour.style.width = 4 + "ch";
        min.style.width = 4 + "ch";
        sec.style.width = 4 + "ch";
        ttd.style.width = 4 + "ch";
        ttt.style.width = 4 + "ch";
        tth.style.width = 4 + "ch";

        for (const input of document.getElementsByTagName('input')) {
            input.addEventListener('input', () => {
                switch (input.id) {
                    case 'hour':
                        hourly = parseFloat(input.value);
                        break;
                    case 'minute':
                        hourly = input.value * 60;
                        break;
                    case 'seconds':
                        hourly = input.value * 60 * 60;
                        break;
                    case 'ttd':
                        hourly = 1 / input.value * 60 * 60;
                        break;
                    case 'ttt':
                        hourly = 10 / input.value * 60;
                        break;
                    case 'tth':
                        hourly = 100 / input.value;
                        break;
                    default:
                        console.log('defaulted');
                }
                
                minutely = hourly / 60;
                secondly = minutely / 60;
                ttdollar = 1 / hourly * 60 * 60;
                ttten = ttdollar / 60 * 10;
                tthundred = ttten * 10 / 60;

                if (Number.isFinite(hourly) && Number.isFinite(ttdollar)) {
                    if (input != hour) hour.value = hourly.toFixed(2);
                    if (input != min) min.value = minutely.toFixed(2);
                    if (input != sec) sec.value = secondly.toFixed(3);
                    if (input != ttd) ttd.value = ttdollar.toFixed(2);
                    if (input != ttt) ttt.value = ttten.toFixed(2);
                    if (input != tth) tth.value = tthundred.toFixed(2);
                    
                    hour.style.width = hour.value.length + "ch";
                    min.style.width = min.value.length + "ch";
                    sec.style.width = sec.value.length + "ch";
                    ttd.style.width = ttd.value.length + "ch";
                    ttt.style.width = ttt.value.length + "ch";
                    tth.style.width = tth.value.length + "ch";
                }
            });
        }
        

        setInterval(() => {
            diff = new Date() - start;
            money = secondly * diff / 1000;
            if (Number.isFinite(money)) {
                counter.innerHTML = money.toFixed(3);
            }
            let secs = Math.floor(diff / 1000 % 60);
            let mins = Math.floor(diff / 1000 / 60 % 60);
            let hours = Math.floor(diff / 1000 / 60 / 60);
            
            time.innerText = hours.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ":" + mins.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) + ":" + secs.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        }, 66)