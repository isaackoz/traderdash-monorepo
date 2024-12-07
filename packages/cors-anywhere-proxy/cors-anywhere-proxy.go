package main

import (
	"cors-anywhere-proxy/cache"
	"cors-anywhere-proxy/jsondata"
	"io"
	"log"
	"net"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"
)

// Regular expression to validate top-level domains
var tldRegexp = regexp.MustCompile(`\.[a-z]{2,}$`)

// Function to validate the hostname
func isValidHostname(hostname string) bool {
	return tldRegexp.MatchString(hostname) || net.ParseIP(hostname) != nil
}

// Function to add CORS headers to the response
func withCORS(header http.Header, req *http.Request) {
	origin := req.Header.Get("Origin")
	if origin != "" {
		header.Set("Access-Control-Allow-Origin", origin)
		header.Set("Vary", "Origin") // Inform caches that the response varies based on the Origin header
	} else {
		header.Set("Access-Control-Allow-Origin", "*")
	}

	header.Set("Access-Control-Allow-Credentials", "true")

	if req.Method == "OPTIONS" {
		header.Set("Access-Control-Max-Age", "86400")
	}
	if acrm := req.Header.Get("Access-Control-Request-Method"); acrm != "" {
		header.Set("Access-Control-Allow-Methods", acrm)
	}
	if acrh := req.Header.Get("Access-Control-Request-Headers"); acrh != "" {
		header.Set("Access-Control-Allow-Headers", acrh)
	}
	// Expose all headers
	headers := make([]string, 0, len(header))
	for k := range header {
		headers = append(headers, k)
	}
	header.Set("Access-Control-Expose-Headers", strings.Join(headers, ","))
}

// Main handler function for incoming requests
func proxyHandler(w http.ResponseWriter, req *http.Request) {
	// Handle preflight (OPTIONS) requests
	if req.Method == "OPTIONS" {
		withCORS(w.Header(), req)
		w.WriteHeader(http.StatusOK)
		return
	}

	// Add CORS headers to the response
	withCORS(w.Header(), req)

	// Extract the target URL from the path
	target := req.URL.Path[1:] // Remove the leading '/'
	if target == "" {
		// Show usage information if no target is provided
		io.WriteString(w, "Usage: http://thisserver.com/http://targeturl.com\n")
		return
	}

	// Handle special case for /iscorsneeded
	if target == "iscorsneeded" {
		w.Header().Set("Content-Type", "text/plain")
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "no")
		return
	}

	// Ensure the URL has a scheme (default to http if missing)
	if !strings.HasPrefix(target, "http://") && !strings.HasPrefix(target, "https://") {
		target = "http://" + target
	}

	// Parse the target URL
	targetURL, err := url.Parse(target)
	if err != nil || targetURL.Scheme == "" || targetURL.Host == "" {
		http.Error(w, "Invalid target URL", http.StatusBadRequest)
		return
	}
	// Add original request query params to the targetURL
	targetURL.RawQuery = req.URL.RawQuery

	// Validate the hostname
	hostname := targetURL.Hostname()
	if !isValidHostname(hostname) {
		http.Error(w, "Invalid host", http.StatusBadRequest)
		return
	}

	// Log target url
	log.Println("Proxying request to:", targetURL)

	// Create a new request to the target URL
	newReq, err := http.NewRequest(req.Method, targetURL.String(), req.Body)
	if err != nil {
		http.Error(w, "Failed to create request: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Copy headers from the original request
	newReq.Header = req.Header.Clone()
	newReq.Header.Del("Origin")
	newReq.Header.Del("Cookie")

	// Use an http.Client with a redirect policy
	client := &http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			if len(via) >= 10 {
				return http.ErrUseLastResponse
			}
			return nil
		},
		Timeout: 30 * time.Second,
	}

	// Make the request
	resp, err := client.Do(newReq)
	if err != nil {
		http.Error(w, "Proxy error: "+err.Error(), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Copy the response headers
	for k, vv := range resp.Header {
		for _, v := range vv {
			w.Header().Add(k, v)
		}
	}
	// Remove cookies
	w.Header().Del("Set-Cookie")
	w.Header().Del("Set-Cookie2")

	// Add CORS headers to the response
	withCORS(w.Header(), req)

	// Set the status code
	w.WriteHeader(resp.StatusCode)

	// Copy the response body
	io.Copy(w, resp.Body)
}

func main() {

	// Init cache
	_, err := cache.CreateRouteCache()
	if err != nil {
		log.Fatal(err)
	}

	_, err = cache.CreateExchangeRateLimitCache()
	if err != nil {
		log.Fatal(err)
	}

	// Get public route info and insert it into a map
	_, err = jsondata.GetPublicRouteMap()
	if err != nil {
		log.Fatal(err)
	}

	_, err = jsondata.GetExchangeConfigMap()
	if err != nil {
		log.Fatal(err)
	}

	server := &http.Server{
		Addr:    ":8080",
		Handler: http.HandlerFunc(proxyHandler),
	}
	// Set up the HTTP server and route
	log.Println("Starting proxy server on :8080")
	log.Fatal(server.ListenAndServe())
}
