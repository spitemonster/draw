import { Url } from "url";

export interface Player {
	playerId: string;
	playerName: string;
	playerScore: number;
	roomCode: string | null;
}