import { type ActFn, jwt } from "@deps";
import { jwtTokenKey, throwError } from "@lib";
import { user } from "../../../mod.ts";

import { compare } from "@da/bcrypt";

export const loginUserFn: ActFn = async (body) => {
	const {
		set: { password, email },
		get,
	} = body.details;

	const createToken = async (user: any) => {
		const token = await jwt.create(
			{ alg: "HS512", typ: "JWT" },
			{
				_id: user._id,
				email: user.email,
				level: user.level,
				exp: jwt.getNumericDate(60 * 60 * 24 * 30 * 3),
			},
			jwtTokenKey,
		);
		return {
			token,
			user,
		};
	};

	get.user.email = 1;
	get.user.password = 1;
	get.user.level = 1;

	const foundedUser = await user.findOne({
		filters: { email },
		projection: get.user,
	});

	if (!foundedUser) {
		throwError("This user does not exist at all!");
	}

	const passIsCorrect = await compare(password, foundedUser!.password);

	if (passIsCorrect) {
		delete foundedUser!.password;
		return await createToken(foundedUser);
	} else {
		throwError("Your password is incorrect!");
	}
};
