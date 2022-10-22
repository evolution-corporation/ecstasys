/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, Image, View, Dimensions } from "react-native";
import Animated from "react-native-reanimated";

import Tools from "~core";
import { TextButton } from "~components/dump";

import useAnimation from "./animated";
import { ArrowButtonMask, ArrowButton, Bird } from "./components";

import type { RootScreenProps } from "~types";
import i18n from "~i18n";

const GreetingScreen: RootScreenProps<"Greeting"> = ({ navigation }) => {
	const { aStyles, setNextValue, setPrevValue } = useAnimation();
	const [text, setText] = useState<{ title: string; description: string }>({
		title: i18n.t("b5bc86ea-4af9-49ac-bb9f-319069df78ee"),
		description: i18n.t("3854a124-ae90-4b64-988b-f2537047f214"),
	});
	const [isShowSkipButton, setIsShowSkipButton] = useState<boolean>(true);
	const nextPage = useCallback(async () => {
		if (!isShowSkipButton) {
			if (navigation.canGoBack()) {
				navigation.goBack();
			}
		} else {
			setNextValue();
			setText({
				title: i18n.t("81cfe4c2-6397-4852-8c1e-ec2338f8832e"),
				description: i18n.t("9a7a79f5-00a3-4ab5-b01e-1260b0d19261"),
			});
			setIsShowSkipButton(false);
		}
	}, [isShowSkipButton]);

	const prevPage = useCallback(async () => {
		setPrevValue();
		setText({
			title: i18n.t("b5bc86ea-4af9-49ac-bb9f-319069df78ee"),
			description: i18n.t("3854a124-ae90-4b64-988b-f2537047f214"),
		});
		setIsShowSkipButton(true);
	}, []);

	return (
		<Animated.View style={[aStyles.background, styles.background]}>
			<Animated.View style={[aStyles.professor, styles.professor]}>
				<Image source={require("./assets/professor.png")} />
			</Animated.View>
			<Animated.View style={[aStyles.bird, styles.bird]}>
				<Bird colorBird={aStyles._colorBird} />
			</Animated.View>
			<View style={styles.text}>
				<Animated.Text style={[aStyles.title, styles.title]}>{text.title}</Animated.Text>
				<Animated.Text style={[aStyles.description, styles.description]}>{text.description}</Animated.Text>
				<View style={styles.menuButton}>
					{isShowSkipButton ? (
						<TextButton>{i18n.t("skip")}</TextButton>
					) : (
						<ArrowButton onPress={() => prevPage()} color={"#9765A8"} />
					)}
					<ArrowButtonMask
						backgroundColor={aStyles.button.backgroundColor}
						color={aStyles.button.color}
						onPress={() => nextPage()}
					/>
				</View>
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	background: {
		flex: 1,
		paddingBottom: 25,
	},
	professor: {
		position: "absolute",
		zIndex: 0,
		right: -430,
		top: -600,
		//width: "50%", height: "50%",
		transform: [{ scale: 0.38 }],
	},
	bird: {
		alignSelf: "center",
		flex: 1,
		zIndex: -1,
	},
	title: {
		fontSize: 32,
		textAlign: "left",
		fontFamily: "Inter_700Bold",
		width: "82%",
	},
	description: {
		fontSize: 20,
		...Tools.gStyle.font("400"),
		color: "#404040",
		opacity: 0.71,
		lineHeight: 22.4,
		marginVertical: 26,
	},
	text: {
		flex: 2,
		paddingHorizontal: 20,
		marginBottom: 25,
		justifyContent: "flex-end",
	},
	menuButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});

export default GreetingScreen;
