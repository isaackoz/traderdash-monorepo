import type { TApiData } from '$lib/types/api';
import type { AddTradeMeta } from '$lib/types/trades';
import type { AddTradeData, AddTradeToDbData } from '@repo/shared-schemas';
import type { TradeInsert, TradeItemInsert } from '@repo/db';
import { connectionsState } from '$stores/connections.svelte';
import type { Trade } from 'ccxt';

/**
 * Handle add trade logic on the client side before sending and saving data in the database
 *
 * Since we have a couple of different options/flows, we need to make sure to handle all of them
 *
 * If the user selects a trade to track, we must get the entire history for that trade on the client side (in browser)
 * and send that data to our server. We will save each trade since the initial one as a row in the database. This way, their trades
 * will load instantly and we don't have to load them in each time the user loads/refreshes the page.
 *
 * If they opt out of tracking a trade history from their exchange, or they manually add one, we will just simply create a trade tracking
 * and initialize it with the first trade.
 * @param addTradeData
 * @param addTradeMeta
 * @returns
 */
export const handleAddTradeFinish = async (
	addTradeData: AddTradeData,
	addTradeMeta: AddTradeMeta
): Promise<TApiData<boolean>> => {
	try {
		const {
			entryPrice,
			exchangeConnectionId,
			fromTimestamp,
			fromTradeId,
			initialAmount,
			marketSymbol,
			side,
			toTimestamp
		} = addTradeData;

		const { liveMarket, syncTrade, trackType } = addTradeMeta;

		// If liveMarket is true, that means the user wants to track a symbol/market from the exchange they chose
		// If it's false, they must manually input the price
		if (liveMarket === true) {
			if (trackType === 'manual') {
				// The user wants live prices thru websocket, but they waant to manually input items
				// We create the first one for them and don't need to check the trade history
				const newTrade: TradeInsert = {
					userExchangeId: exchangeConnectionId,
					tickerBase: marketSymbol.split('/')[0],
					tickerQuote: marketSymbol.split('/')[1],
					marketSymbol,
					fromTimestamp,
					syncTrade: false,
					liveMarket,
					type: 'SPOT',
					direction: side
				};

				const firstTradeItem: TradeItemInsert = {
					amount: String(initialAmount),
					entryPrice: String(entryPrice),
					side,
					transactionId: fromTradeId,
					timestamp: fromTimestamp
				};

				const { data, error } = await addTrade({
					tradeData: newTrade,
					tradeItems: [firstTradeItem]
				});
				if (error) {
					return {
						error: {
							message: error.message
						}
					};
				}
				// todo save data to db api
			} else {
				// Lastly, we'll deal with the primary use case where a user tracks from a specific trade up to
				// either a toTimestamp, or realtime. In both cases, we use CCXT
				const ccxtExchange = connectionsState.connections.get(exchangeConnectionId)?.ccxtExchanges;
				if (!ccxtExchange) {
					throw new Error('Exchange not available in memory');
				}

				let tradeHistory: Trade[];

				if (syncTrade === true) {
					// If the user is syncing trades to the current time, we will get all trades fromTimestamp to Date.now(),
					tradeHistory = await ccxtExchange.fetchMyTrades(marketSymbol, fromTimestamp, undefined, {
						paginate: true,
						until: Date.now()
					});
				} else {
					// Otherwise, we'll get all trades fromTimestamp to toTimestamp,
					tradeHistory = await ccxtExchange.fetchMyTrades(marketSymbol, fromTimestamp, undefined, {
						paginate: true,
						until: toTimestamp
					});
				}

				// Now transform history items from Trade[] -> TradeItem[]
				const tradeItems = tradeHistory.map((trade): TradeItemInsert => {
					return {
						amount: trade.amount?.toString() ?? '0',
						entryPrice: trade.price.toString(),
						side: trade.side === 'sell' ? 'sell' : 'buy',
						transactionId: trade.id,
						timestamp: trade.timestamp,
						feeCost: trade.fee?.cost?.toString(),
						feeCurrency: trade.fee?.currency
					};
				});

				// Construct our trade
				const newTrade: TradeInsert = {
					userExchangeId: exchangeConnectionId,
					tickerBase: marketSymbol.split('/')[0],
					tickerQuote: marketSymbol.split('/')[1],
					marketSymbol,
					fromTimestamp,
					toTimestamp,
					syncTrade,
					liveMarket,
					type: 'SPOT',
					direction: side
				};

				const { data, error } = await addTrade({
					tradeData: newTrade,
					tradeItems: tradeItems
				});
				if (error) {
					return {
						error: {
							message: error.message
						}
					};
				}

				// todo save to database
			}
		} else {
			// We don't need to access the exchange using CCXT. We just simply add straight to the database

			const newTrade: TradeInsert = {
				userExchangeId: exchangeConnectionId,
				tickerBase: marketSymbol.split('/')[0],
				tickerQuote: marketSymbol.split('/')[1],
				marketSymbol,
				fromTimestamp,
				toTimestamp,
				syncTrade: false,
				liveMarket: false,
				type: 'SPOT',
				direction: side
			};

			const firstTradeItem: Omit<TradeItemInsert, 'tradeId'> = {
				amount: String(initialAmount),
				entryPrice: String(entryPrice),
				side,
				transactionId: fromTradeId,
				timestamp: fromTimestamp
			};

			const { data, error } = await addTrade({
				tradeData: newTrade,
				tradeItems: [firstTradeItem]
			});
			if (error) {
				return {
					error: {
						message: error.message
					}
				};
			}
		}
	} catch (e) {
		console.error(e);
		if (e instanceof Error) {
			return {
				error: {
					message: e.message
				}
			};
		}
		return {
			error: {
				message: 'Unknown error occured'
			}
		};
	}
};

//
export const addTrade = async (tradeData: AddTradeToDbData): Promise<TApiData<boolean>> => {
	try {
		//
	} catch (e) {
		console.error(e);
		if (e instanceof Error) {
			return {
				error: {
					message: e.message
				}
			};
		}
		return {
			error: {
				message: 'Unknown error occured'
			}
		};
	}
};
