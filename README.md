# nodelog
Like datadog? but local for developers helping in developement

sometimes we need a application where we want to push logs from either local developement
which is easier in once place to either see the structure of data, or to catch weird
errors, like wordpress, or backend applications

so its a simple app, just require nodejs, db is sqlite so no other db connection required
no setup just 

npm install and ready to take logs

endpoint for ingestion of logs is

    http://<host>//reporting/log

    here is one such function example in php, can be easily converted to other languages
    using chatgpt

``` php

function datahog($data, $title = "EMPTY TITLE", $type = "info", $domain = "", $subdomain = "")
{
    if($_SERVER['HTTP_HOST'] != "somelocalsite.test")
    {
         return;
    }

    $local_url = 'http://localhost:8000/reporting/log/';

    $data = array(
         'title' => $title,
         'data' => base64_encode(print_r($data, true)),
         'type' => $type,
         'domain' => $domain,
         'subdomain' => $subdomain
    );

    // Encode data as JSON
    $json_data = json_encode($data);

    $args = array(
         'body'    => $json_data,
         'headers' => array(
             'Content-Type' => 'application/json',
         ),
    );

    $response = wp_remote_post($local_url, $args);
}

```

``` javascript

// javascript side func tion, add to wp_footer action

<script type="text/javascript">
    function datahog(data, title = "EMPTY TITLE", type = "info", domain = "", subdomain = "") {
        const localUrl = 'http://localhost:8000/reporting/log/';

        const data = {
            title: title,
            data: btoa(JSON.stringify(data)), // Using btoa to encode data as base64
            type: type,
            domain: domain,
            subdomain: subdomain
        };

        fetch(localUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            // Handle response here
            console.log('Response:', response);
        })
        .catch(error => {
            // Handle error here
            console.error('Error:', error);
        });
    }
</script>
```