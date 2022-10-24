/** @format */

import React from "react";
import RN, { Dimensions, ScrollView, StyleSheet } from "react-native";
import Heart from "assets/icons/Heart_Red.svg";
import Start from "assets/icons/Star.svg";
import { DoubleColorView } from "~components/containers";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import i18n from "~i18n";
import gStyle from "~styles";
import { useAppSelector } from "~store";
import * as Models from "src/models";
import * as Dump from "src/components/dump";
import { StatisticPeriod, GeneralCompositeScreenProps, State } from "~types";

const getStartWeek = () => {
	const date = new Date();
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() - date.getDay());
	return date;
};

const getStartMonth = () => {
	const date = new Date();
	date.setHours(23, 59, 59, 999);
	date.setDate(0);
	return date;
};

const Profile: GeneralCompositeScreenProps = ({ navigation }) => {
	//* local state
	const tabBarHeight = useBottomTabBarHeight();
	const [statisticPeriod, setStatisticPeriod] = React.useState<StatisticPeriod>(StatisticPeriod.MONTH);
	const [heightScreen, setHeightScreen] = React.useState<number | null>(null);
	//* global state
	const { displayName, image, nickName } = useAppSelector(store => {
		if (store.account.currentData === undefined) throw new Error("Not found user");
		return store.account.currentData;
	});
	const [statisticCount, statisticTime] = useAppSelector(store => {
		let listPracticesListened: {
			dateListen: string;
			msListened: number;
			practice: State.Practice;
		}[] = [];
		if (statisticPeriod === StatisticPeriod.WEEK) {
			listPracticesListened = store.practice.listPracticesListened.filter(
				item => new Date(item.dateListen) >= getStartWeek()
			);
		} else if (statisticPeriod === StatisticPeriod.MONTH) {
			listPracticesListened = store.practice.listPracticesListened.filter(
				item => new Date(item.dateListen) >= getStartMonth()
			);
		} else {
			listPracticesListened = store.practice.listPracticesListened;
		}
		return [listPracticesListened.length, listPracticesListened.reduce((value, item) => value + item.msListened, 0)];
	});
	const subscribe = useAppSelector(store => {
		if (store.account.subscribe === undefined) return null;
		const endSubscribe = new Date(store.account.subscribe.whenSubscribe);
		endSubscribe.setDate(
			endSubscribe.getDate() +
				(store.account.subscribe.type === "WEEK" ? 7 : store.account.subscribe.type === "MONTH" ? 30 : 90)
		);
		if (endSubscribe.getTime() >= Date.now())
			return {
				endSubscribe: new Date(store.account.subscribe.whenSubscribe),
				autoPayment: store.account.subscribe.autoPayment,
			};
		return null;
	});

	const historyMeditation = useAppSelector(store => {
		return store.practice.listPracticesListened.map(item => item.practice);
	});

	React.useEffect(() => {
		navigation.setOptions({
			title: nickName,
		});
	}, [nickName]);
	return (
		<DoubleColorView
			style={styles.background}
			heightViewPart={300}
			onLayout={({ nativeEvent: { layout } }) => {
				setHeightScreen(layout.height);
			}}
		>
			<ScrollView>
				<Dump.ProfileInformation
					image={image}
					displayName={displayName}
					subscribeInformation={
						subscribe === null
							? undefined
							: { endSubscribe: subscribe.endSubscribe, isAutoPayment: subscribe.autoPayment }
					}
					onPress={() => {
						navigation.navigate("EditMainUserData");
					}}
				/>
				<Dump.SelectTimePeriodStatistic onChangePeriod={setStatisticPeriod} style={{ marginTop: 16 }} />
				<Dump.StatisticsMeditation count={statisticCount} time={statisticTime} style={{ marginTop: 9 }} />
				<Dump.ColorWithIconButton
					icon={<Heart />}
					styleButton={[styles.button, { marginTop: 18 }]}
					styleText={styles.buttonText}
					onPress={() => {
						navigation.navigate("FavoriteMeditation");
					}}
				>
					{i18n.t("6a85652b-a14f-4545-8058-9cdad43f3de1")}
				</Dump.ColorWithIconButton>
				<Dump.ColorWithIconButton
					icon={<Start />}
					styleButton={styles.button}
					styleText={styles.buttonText}
					onPress={() => {
						navigation.navigate("SelectSubscribe");
					}}
				>
					{i18n.t("b2f016a6-b60e-4b5f-9cd9-ead2bddaa9d5")}
				</Dump.ColorWithIconButton>
				{heightScreen !== null && heightScreen - tabBarHeight > 550 && (
					<>
						<RN.Text style={styles.historyText}>{i18n.t("7923b738-2122-408b-af79-caf0b1643cdf")}</RN.Text>
						<Dump.ShowListPractices historyPractices={historyMeditation} />
					</>
				)}
			</ScrollView>
		</DoubleColorView>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#7C3D91",
		borderRadius: 10,
		paddingHorizontal: 20,
		justifyContent: "flex-start",
		paddingLeft: 60,
		marginVertical: 7.5,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 14,
		...gStyle.font("500"),
	},
	background: { flex: 1, paddingHorizontal: 20 },
	historyText: {
		marginTop: 16,
		color: "#3D3D3D",
		fontSize: 20,
		...gStyle.font("600"),
	},
});

export default Profile;