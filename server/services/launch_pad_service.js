import Preconditions from "../utils/preconditions.js";
import ResponseHandler from "../utils/response_handler.js"
import { StatusCodes } from 'http-status-codes';
import Strings from "../lang/strings.js";

class LaunchPadService {
    static async createPackage(req, res) {
        const {
            title, description,
            whitepaper, goal,
            discord_link, website,
            discord_id, email,
            members, twitter,
            linkedin,
            nft_type, mint_date,
            mint_price, mint_supply,
            marketing_plan,
            more_info, presale,
            artwork,
        } = req.body;

        const badRequestError = Preconditions.checkNotNull({
            title,
            description,
            email,
        });
        if (badRequestError) {
            return ResponseHandler.sendErrorResponse(res, StatusCodes.BAD_REQUEST, badRequestError);
        };
        try {
            const createPackage = await LaunchPadModel.create({
                title,
                description,
                discord_id,
                email, website,
                linkedin, twitter,
                mint_date, mint_supply,
                nft_type, mint_price,
                discord_link, members,
                whitepaper, goal,
                marketing_plan, more_info,
                presale,
                artwork
            });
            await createPackage.save();
            return ResponseHandler.sendResponseWithoutData(res, StatusCodes.OK, Strings.PACKAGE_SUCCESSFULLY_CREATED);
        }
        catch (error) {
            console.error(error);
            return ResponseHandler.sendErrorResponse(res, StatusCodes.BAD_REQUEST, Strings.ERROR_RESPONSE);
        }
    }
}

export default LaunchPadService;

import LaunchPadModel from "../models/launch_pad_model.js";
import FileService from "./file_service.js";