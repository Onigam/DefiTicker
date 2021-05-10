






/*chrome.runtime.onMessage.addListener( function(event) {
    browser.browserAction.setBadgeText({
        text: "test"
    });
});*/
chrome.runtime.onInstalled.addListener(function() {
    console.log('onInstalled...');

    chrome.alarms.create('refresh', { periodInMinutes: 1 });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'developer.chrome.com'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    fetchRewards();
  });
  
  function fetchRewards() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {

        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            // Runs when the request is successful
            //console.log(xhr.responseText);

            const res = JSON.parse(xhr.responseText);

            const rewardInDollar = 0;
            for(var i=0; i<res.farms.length; i++) {
                const reward = res.farms[i].reward;
                rewardInDollar += parseFloat(reward.balance * reward.price).toFixed(0);
            }    

            // TODO        
            /*chrome.storage.sync.set({rewardInDollar: rewardInDollar}, function() {
                
              });*/

            console.log(`Rewards : ${rewardInDollar} $`);

            if (chrome.browserAction && chrome.browserAction.setBadgeText) {
                chrome.browserAction.setBadgeText({
                    text: `${rewardInDollar}`
                });    

                chrome.browserAction.setBadgeBackgroundColor({
                    color: [0,200,0,0]
                });
            }

        } else {
            // Runs when it's not
            console.log(xhr.responseText);
        }
    
    };

    xhr.open('GET', 'https://api2.apeboard.finance/pancake-bsc/<your_bsc_addr>');
    xhr.send();
/*    chrome.browserAction.setBadgeText({
        text: "100$"
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: [200,0,0,0]
    });*/
  }