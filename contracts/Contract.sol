/**
 * SPDX-License-Identifier: MIT
 * Submitted for verification at Etherscan.io on 2021-01-26
*/

pragma solidity >=0.6.0 <0.8.0;
abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

/*
*
*
*/

pragma solidity >=0.6.0 <0.8.0;
interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

/*
*
*
*/

pragma solidity >=0.6.0 <0.8.0;
library SafeMath {
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        uint256 c = a + b;
        if (c < a) return (false, 0);
        return (true, c);
    }

    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b > a) return (false, 0);
        return (true, a - b);
    }

    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) return (true, 0);
        uint256 c = a * b;
        if (c / a != b) return (false, 0);
        return (true, c);
    }

    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a / b);
    }

    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a % b);
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: modulo by zero");
        return a % b;
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        return a - b;
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a / b;
    }

    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a % b;
    }
}

/*
*
*
*/

pragma solidity >=0.6.2 <0.8.0;
library Address {
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }

    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }

    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.call{ value: value }(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    function functionStaticCall(address target, bytes memory data, string memory errorMessage) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.staticcall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    function functionDelegateCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    function _verifyCallResult(bool success, bytes memory returndata, string memory errorMessage) private pure returns(bytes memory) {
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

/*
*
*
*/

pragma solidity >=0.6.0 <0.8.0;
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

/*
* This token is largely based on Reflect.finance token, except with a higher 5% rate
* https://github.com/reflectfinance/reflect-contracts
*/

pragma solidity ^0.6.2;
contract SimianToken is Context, IERC20, Ownable {
    using SafeMath for uint256;
    using Address for address;

    // Standard accounts use the reflection balances (rOwned)
    // Excluded accounts use the token balances (tOwned)
    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;

    // Map of spending allowances by account
    mapping (address => mapping (address => uint256)) private _allowances;

    // Map of accounts which are excluded from reflection (cannot earn the fee distribution)
    mapping (address => bool) private _isExcluded;
    address[] private _excluded;

    // Initial token supply is 5 million
    // Initial reflection supply is a very, very large number (but decreases as fees are collected)
    // There is a direct mathematical relationship between 5 million supply and 5% transfer fee
    uint256 private constant MAX = ~uint256(0);
    uint256 private constant _tTotal = 5 * 10**6 * 10**9;
    uint256 private _rTotal = (MAX - (MAX % _tTotal));
    uint256 private _tFeeTotal;

    // Token constants
    string private _name = 'simian.finance';
    string private _symbol = 'SIFI';
    uint8 private _decimals = 9;

    // Transfer all reflective tokens to contract creator on first deploy
    // Since the contract creator is not excluded, they use the `rOwned` balance mapping
    constructor () public {
        _rOwned[_msgSender()] = _rTotal;
        emit Transfer(address(0), _msgSender(), _tTotal);
    }

    // Gets the name of the token (simian.finance)
    function name() public view returns (string memory) {
        return _name;
    }

    // Gets the ticker symbol of the token (SIFI)
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // Gets the maximum number of decimal places (9)
    function decimals() public view returns (uint8) {
        return _decimals;
    }

    // Gets the total supply of the token (5 million)
    function totalSupply() public view override returns (uint256) {
        return _tTotal;
    }

    // Gets the current balance of an account (address)
    // If the account is a standard account, use the reflective balance (rOwned)
    // If the account is an excluded account, use the token balance (tOwned)
    function balanceOf(address account) public view override returns (uint256) {
        if (_isExcluded[account]) return _tOwned[account];
        return tokenFromReflection(_rOwned[account]);
    }

    // Transfers tokens from the sender to the recipient
    // Any transaction fees will be applied to non-excluded accounts, and any fees reflected to holders
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    // Gets the spending allowance on the behalf of another account
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    // Approves an amount to be spent on the behalf of another account
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    // Transfers tokens from one account to another on their behalf
    // Any transaction fees will be applied and any fees reflected to holders
    // This requires the sender to have approved an allowance prior to it being sent on their behalf
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    // Increases the allowance for another account to spend on behalf of the sender
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    // Decreases the allowance for another account to spend on behalf of the sender
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    // Gets whether an account is excluded from the reflection balance system
    function isExcluded(address account) public view returns (bool) {
        return _isExcluded[account];
    }

    // Gets the total transfer fees that have been collected over the lifetime of the contract
    function totalFees() public view returns (uint256) {
        return _tFeeTotal;
    }

    // Consumes an amount of reflection (rOwned) held by the sender, redistributing it to all holders
    // This could be considered something like an "airdrop" or "making it rain"
    // Since excluded accounts use the token system (tOwned) and not reflection, they cannot call this function
    function reflect(uint256 tAmount) public {
        address sender = _msgSender();
        require(!_isExcluded[sender], "Excluded addresses cannot call this function");
        (uint256 rAmount,,,,) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rTotal = _rTotal.sub(rAmount);
        _tFeeTotal = _tFeeTotal.add(tAmount);
    }

    // Calculates the amount of equivalent reflection from a given amount of SIFI tokens (balance)
    // This is done by determining the ratio of reflection to tokens in circulation (rSupply:tSupply)
    function reflectionFromToken(uint256 tAmount, bool deductTransferFee) public view returns(uint256) {
        require(tAmount <= _tTotal, "Amount must be less than supply");
        if (!deductTransferFee) {
            (uint256 rAmount,,,,) = _getValues(tAmount);
            return rAmount;
        } else {
            (,uint256 rTransferAmount,,,) = _getValues(tAmount);
            return rTransferAmount;
        }
    }

    // Calculates the amount of SIFI tokens from a given amount of reflection (balance)
    // This is done by determining the ratio of reflection to tokens in circulation (rSupply:tSupply)
    // Over time as fees are collected, the ratio decreases essentially making reflection more valuable
    // This is the mechanism that drives the 5% redistribution from transfer fees
    function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
        require(rAmount <= _rTotal, "Amount must be less than total reflections");
        uint256 currentRate =  _getRate();
        return rAmount.div(currentRate);
    }

    // Sets an account to be excluded from the reflection balance system
    // If the account has a reflection balance it will be converted into a token balance
    // NOTE: This function can only be called by the contract owner
    // On mainnet, ownership has been renounced (burned) and this function can never be called again
    function excludeAccount(address account) external onlyOwner() {
        require(!_isExcluded[account], "Account is already excluded");
        if(_rOwned[account] > 0) {
            _tOwned[account] = tokenFromReflection(_rOwned[account]);
        }
        _isExcluded[account] = true;
        _excluded.push(account);
    }

    // Sets an account as included in the reflection balance system
    // This function can only be called by the contract owner
    // On mainnet, ownership has been renounced (burned) and this function can never be called again
    function includeAccount(address account) external onlyOwner() {
        require(_isExcluded[account], "Account is already excluded");   // This is a typo in the error message
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_excluded[i] == account) {
                _excluded[i] = _excluded[_excluded.length - 1];
                _tOwned[account] = 0;
                _isExcluded[account] = false;
                _excluded.pop();
                break;
            }
        }
    }

    // PRIVATE: Approves allowances for another account to spend on the owner's behalf
    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    // PRIVATE: Transfers tokens from one account to another
    // This will apply any transaction fees and updating balances (including reflection)
    function _transfer(address sender, address recipient, uint256 amount) private {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        if (_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferFromExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && _isExcluded[recipient]) {
            _transferToExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferStandard(sender, recipient, amount);
        } else if (_isExcluded[sender] && _isExcluded[recipient]) {
            _transferBothExcluded(sender, recipient, amount);
        } else {
            _transferStandard(sender, recipient, amount);
        }
    }

    // PRIVATE: Transfers tokens between two "standard" (non-excluded) accounts
    // Since both accounts are standard, they both use just the `rOwned` reflection balances
    function _transferStandard(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee) = _getValues(tAmount);
        // Subtract the reflection amount from the sender
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        // Add the reflection transfer amount to the recipient (minus fees)
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    // PRIVATE: Transfers tokens from a standard account to an excluded account
    // Example: You transferring to Uniswap as part of a token swap (SIFI=>ETH)
    // Since Uniswap is excluded, they use the token balance (tOwned)
    function _transferToExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee) = _getValues(tAmount);
        // Subtract the reflection amount from the sender
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        // Add the token and reflection amount to the excluded recipient
        // Even though the recipient is excluded and does not use the reflection system, it's for affecting rSupply
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    // PRIVATE: Transfers tokens from an excluded account to a standard account
    // Example: Uniswap transferring to you as part of a token swap (ETH=>SIFI)
    // Since Uniswap is excluded, they use the token balance (tOwned)
    function _transferFromExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee) = _getValues(tAmount);
        // Subtract the reflection and token amount from the excluded sender
        // Even though the sender is excluded and does not use the reflection system, it's for affecting rSupply
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        // Add the reflection transfer amount to the recipient (minus fess)
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    // PRIVATE: Transfers tokens between two excluded accounts
    // Example: Uniswap transferring to another DEX/CEX for liquidity
    // Since Uniswap is the only excluded account, this never happens on mainnet
    function _transferBothExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee) = _getValues(tAmount);
        // Subtract the reflection and token amount from the excluded sender
        // Even though the sender is excluded and does not use the reflection system, it's for affecting rSupply
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        // Add the reflection and token amount to the excluded recipient (minus fees)
        // Even though the recipient is excluded and does not use the reflection system, it's for affecting rSupply
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    // Reduces the total reflection supply based on the fee collected
    // This essentially acts as a redistribution of fees for reflection balance holders
    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal = _rTotal.sub(rFee);
        _tFeeTotal = _tFeeTotal.add(tFee);
    }

    // Returns a tuple containing both reflection and token transaction values
    // The reflection values are calculated by applying the current ratio of reflection supply to token supply (rSupply:tSupply)
    // Ex: 10000 => (1000000, 950000, 50000, 9500, 500)
    function _getValues(uint256 tAmount) private view returns (uint256, uint256, uint256, uint256, uint256) {
        (uint256 tTransferAmount, uint256 tFee) = _getTValues(tAmount);
        uint256 currentRate =  _getRate();
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee) = _getRValues(tAmount, tFee, currentRate);
        return (rAmount, rTransferAmount, rFee, tTransferAmount, tFee);
    }

    // Returns a tuple containing the token transactional values, both the net amount and fee that was deducted (5%)
    // Ex: 10000 => (9500, 500)
    function _getTValues(uint256 tAmount) private pure returns (uint256, uint256) {
        uint256 tFee = tAmount.mul(5).div(100);
        uint256 tTransferAmount = tAmount.sub(tFee);
        return (tTransferAmount, tFee);
    }

    // Returns a tuple containing the reflected values used to redistribute fees to token holders
    // The current rate is determined by calculating the ratio of reflection to tokens in circulation (rSupply:tSupply)
    // The rate will typically be a very high value, but decrease over time as fees are collected
    // Ex: (10000, 500, rate = 100) => (1000000, 950000, 50000)
    function _getRValues(uint256 tAmount, uint256 tFee, uint256 currentRate) private pure returns (uint256, uint256, uint256) {
        uint256 rAmount = tAmount.mul(currentRate);
        uint256 rFee = tFee.mul(currentRate);
        uint256 rTransferAmount = rAmount.sub(rFee);
        return (rAmount, rTransferAmount, rFee);
    }

    // Gets the current ratio of reflection to tokens in circulation (rSupply:tSupply)
    // This number will start out very large and gradually get smaller as transaction fees are distributed
    // Ex: => 56294995 (calculated from 281474975000000 / 5000000)
    function _getRate() private view returns(uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply.div(tSupply);
    }

    // Returns a tuple containing the current reflection and token supply amounts in circulation
    // Ex: => (281474975000000, 5000000)
    function _getCurrentSupply() private view returns(uint256, uint256) {
        // Assume initial reflection supply and token supply
        uint256 rSupply = _rTotal;  // a huge number, gradually decreasing by fees
        uint256 tSupply = _tTotal;  // 5000000

        // Reduce supply by reflection and tokens held by excluded accounts
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_rOwned[_excluded[i]] > rSupply || _tOwned[_excluded[i]] > tSupply) return (_rTotal, _tTotal);
            rSupply = rSupply.sub(_rOwned[_excluded[i]]);
            tSupply = tSupply.sub(_tOwned[_excluded[i]]);
        }

        if (rSupply < _rTotal.div(_tTotal)) return (_rTotal, _tTotal);
        return (rSupply, tSupply);
    }
}