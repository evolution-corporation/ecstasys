/** @format */

import React, { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import auth from "@react-native-firebase/auth";

import { ColorButton } from "~components/dump";
import Tools from "~core";
import { RootScreenProps } from "~types";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { converterDisplayNameToNickname, generateNickname } from "~tools";
import NicknameBase, { StatusCheck } from "~components/dump/NicknameInput/NicknameBase";
import i18n from "~i18n";

import CheckMarkerGreen from "~assets/icons/CheckMarkerGreen.svg";
import { useFocusEffect } from "@react-navigation/native";

const InputLoginScreen: RootScreenProps<"InputNickname"> = ({ navigation }) => {
	const appDispatch = useAppDispatch();
	const resultCheckNickname = useAppSelector(store => {
		if (store.account.changeData.lastCheckNicknameAndResult === undefined) return false;
		return store.account.changeData.lastCheckNicknameAndResult[1];
	});

	const [variableNicknameList, setVariableNicknameList] = useState<string[]>([]);
	const NicknameBaseRef = useRef<ElementRef<typeof NicknameBase>>(null);

	const processing = async (checkedNickname: string, statusCheck: StatusCheck) => {
		if (statusCheck === StatusCheck.USED) {
			setVariableNicknameList(await generateNickname(checkedNickname));
		}
	};

	useFocusEffect(
		useCallback(() => {
			const user = auth().currentUser;
			if (!!user && !!user.displayName) {
				const convertedDisplayName = converterDisplayNameToNickname(user.displayName);
				if (convertedDisplayName) NicknameBaseRef.current?.editNickname(convertedDisplayName);
			}
		}, [])
	);

	return (
		<View style={styles.background}>
			<NicknameBase
				ref={NicknameBaseRef}
				onEndChange={processing}
				checkValidateNickname={async (nickname: string) => {
					return (await appDispatch(actions.addChangedInformationUser({ nickname })).unwrap())
						.lastCheckNicknameAndResult?.[1] ?? false
						? StatusCheck.FREE
						: StatusCheck.USED;
				}}
			/>
			{variableNicknameList.length > 0 && (
				<View style={[styles.variableNicknameList]}>
					{variableNicknameList.map((item, index) => (
						<Pressable
							style={[styles.variableNicknameRow, index < variableNicknameList.length - 1 ? styles.separator : null]}
							key={index}
							onPress={() => {
								NicknameBaseRef.current?.editNickname(item);
							}}
						>
							<Text style={styles.variableNicknameText}>{item}</Text>
							<CheckMarkerGreen />
						</Pressable>
					))}
				</View>
			)}
			<Text style={styles.subText}>{i18n.t("f0955b62-3ce1-49d6-bf79-aba68266ef8e")}</Text>
			<ColorButton
				onPress={() => {
					navigation.navigate("InputImageAndBirthday");
				}}
				disabled={!resultCheckNickname}
			>
				{i18n.t("continue")}
			</ColorButton>
		</View>
	);
};

const styles = StyleSheet.create({
	background: {
		paddingHorizontal: 30,
		paddingBottom: 75,
		justifyContent: "flex-start",
		backgroundColor: "#9765A8",
		flex: 1,
	},
	ColorButtonStyle: { marginVertical: 10 },
	subText: {
		fontSize: 13,
		lineHeight: 20,
		textAlign: "center",
		color: "#E7DDEC",
		...Tools.gStyle.font("400"),
	},
	variableNicknameList: {
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
	},
	variableNicknameRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 44,
		paddingHorizontal: 10,
	},
	variableNicknameText: {
		color: "#555555",
		fontSize: 13,
		lineHeight: 16,
		...Tools.gStyle.font("400"),
	},
	separator: {
		borderBottomWidth: 1,
		width: "100%",
		borderColor: "#C2A9CE",
	},
});

export default InputLoginScreen;
