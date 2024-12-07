package jsondata

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
)

type PublicRoute struct {
	Exchange string `json:"exchange"`
	TTL      int    `json:"ttl"`
}

type PublicRoutes = map[string]PublicRoute

func GetPublicRouteMap() (PublicRoutes, error) {
	jsonFile, err := os.Open("public-routes.json")
	if err != nil {
		return PublicRoutes{}, err
	}
	defer jsonFile.Close()

	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		return PublicRoutes{}, err
	}

	publicRoutes := make(map[string]PublicRoute)
	err = json.Unmarshal(byteValue, &publicRoutes)
	if err != nil {
		return PublicRoutes{}, err
	}

	// print
	fmt.Println(publicRoutes)

	return publicRoutes, nil
}

type ExchangeConfig struct {
	MaxReqPerSec int `json:"maxReqPerSec"`
}

type ExchangeConfigs = map[string]ExchangeConfig

func GetExchangeConfigMap() (ExchangeConfigs, error) {
	jsonFile, err := os.Open("exchange-configs.json")
	if err != nil {
		return ExchangeConfigs{}, err
	}
	defer jsonFile.Close()

	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		return ExchangeConfigs{}, err
	}

	exchangeConfigs := make(map[string]ExchangeConfig)
	err = json.Unmarshal(byteValue, &exchangeConfigs)
	if err != nil {
		return ExchangeConfigs{}, err
	}

	// print
	fmt.Println(exchangeConfigs)

	return exchangeConfigs, nil
}
