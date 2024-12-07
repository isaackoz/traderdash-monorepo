package cache

import (
	"github.com/dgraph-io/ristretto/v2"
)

type ConfigEntry struct {
	URL      string
	TTL      int // TTL in seconds
	Exchange string
}

type Exchange struct {
	MaxReqPerSec int
}

// ExchangeMap stores exchange-specific rate limits
var ExchangeMap map[string]Exchange

// ConfigEntries contains the configuration entries for caching
var ConfigEntries = []ConfigEntry{
	{"https://api.coinbase.com/v2/currencies", 300, "coinbase"},
}

// Key is the exchange ID, such as "coinbase"
// Value is the current counter of the requests per second, such as 4 to indicate there has been 4 requests in the last second
type ExchangeRateLimitCache = *ristretto.Cache[string, int]
type RouteCache = *ristretto.Cache[string, string]

// InitCache initializes BigCache and returns a MyCache instance
func CreateRouteCache() (RouteCache, error) {
	ExchangeMap = make(map[string]Exchange)
	ExchangeMap["coinbase"] = Exchange{
		MaxReqPerSec: 10,
	}

	cache, err := ristretto.NewCache(&ristretto.Config[string, string]{
		NumCounters: 10000,   // number of keys to track frequency of (10M).
		MaxCost:     1 << 30, // maximum cost of cache (1GB).
		BufferItems: 64,      // number of keys per Get buffer.
	})

	if err != nil {
		return nil, err
	}

	defer cache.Close()

	return cache, nil
}

func CreateExchangeRateLimitCache() (ExchangeRateLimitCache, error) {
	cache, err := ristretto.NewCache(&ristretto.Config[string, int]{
		NumCounters:        500, // 500 / 10 = ~50 keys
		MaxCost:            100, //
		BufferItems:        64,  // number of keys per Get buffer.
		IgnoreInternalCost: true,
	})

	if err != nil {
		return nil, err
	}

	defer cache.Close()

	return cache, nil
}
