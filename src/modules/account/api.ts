import auth from "@react-native-firebase/auth";
import {headers} from "~api";

import {converterNameSurnameToDisplayName, ConverterUserDataToApplication, serverUrl} from "./tools";
import { UpdateUserData } from './types'

export async function registration(nickname: string, birthday: Date, image?: string) {
	const request = await fetch(serverUrl.usersURL, {
		method: "POST",
		headers: await headers(),
		body: JSON.stringify({
			NickName: nickname,
			birthday: birthday.toISOString(),
			image
		})
	});
	if (request.ok) {
		const json = await request.json();
		return ConverterUserDataToApplication(json.result);
	} else {
		throw new Error(`API ERROR. CODE: ${request.status}`);
	}
}

export async function authentication() {
	const user = auth().currentUser
	if (!user) {
		throw new Error(`User not found`)
	}
		const uid = user.uid
		const request = await fetch(`${serverUrl.usersURL}/${uid}`, {
			method: "GET",
			headers: await headers()
		});
		if (request.status === 404) {
			return null
		}
		if (request.ok) {
			const json = await request.json();
			return ConverterUserDataToApplication(json.result);
		} else {
			throw new Error(`API ERROR. CODE: ${request.status}`);
		}

}

export async function update(data: UpdateUserData) {
	const request = await fetch(serverUrl.usersURL, {
		method: "UPDATE",
		headers: await headers(),
		body: JSON.stringify({
			Image: data.image,
			Birthday: data.birthday,
			Nickname: data.nickName,
			Display_name: converterNameSurnameToDisplayName(data.name, data.surname),
		})
	});
	if (request.ok) {
		const json = await request.json();
		return ConverterUserDataToApplication(json.result);
	} else {
		throw new Error(`API ERROR. CODE: ${request.status}`);
	}
}