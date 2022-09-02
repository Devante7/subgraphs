import * as utils from "../common/utils";
import * as constants from "../common/constants";
import { CustomPriceType } from "../common/types";
import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { AaveOracleContract } from "../../../generated/UniswapV2Factory/AaveOracleContract";

export function getAaveOracleContract(network: string): AaveOracleContract {
  return AaveOracleContract.bind(
    constants.AAVE_ORACLE_CONTRACT_ADDRESS.get(network)
  );
}

export function getTokenPriceFromAaveOracle(
  tokenAddr: Address,
  network: string
): CustomPriceType {
  const aaveOracleContract = getAaveOracleContract(network);

  if (!aaveOracleContract) {
    return new CustomPriceType();
  }

  let tokenPrice: BigDecimal = utils
    .readValue<BigInt>(
      aaveOracleContract.try_getAssetPrice(tokenAddr),
      constants.BIGINT_ZERO
    )
    .toBigDecimal();

  return CustomPriceType.initialize(
    tokenPrice,
    constants.USDC_DECIMALS_MAP.get(network)!.toI32() as u8
  );
}