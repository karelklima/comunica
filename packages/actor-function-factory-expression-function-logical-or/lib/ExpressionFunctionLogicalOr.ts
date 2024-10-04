import { ExpressionFunctionBase } from '@comunica/bus-function-factory';
import type {
  IEvalContext,
  TermExpression,
} from '@comunica/expression-evaluator';
import {
  bool,
  SparqlOperator,
} from '@comunica/expression-evaluator';

/**
 * https://www.w3.org/TR/sparql11-query/#func-logical-or
 * This function doesn't require type promotion or subtype-substitution, everything works on TermExpression
 */
export class ExpressionFunctionLogicalOr extends ExpressionFunctionBase {
  public constructor() {
    super({
      arity: 2,
      operator: SparqlOperator.LOGICAL_OR,
      apply: async({ args, mapping, exprEval }: IEvalContext): Promise<TermExpression> => {
        const [ leftExpr, rightExpr ] = args;
        try {
          const leftTerm = await exprEval.evaluatorExpressionEvaluation(leftExpr, mapping);
          const left = leftTerm.coerceEBV();
          if (left) {
            return bool(true);
          }
          const rightTerm = await exprEval.evaluatorExpressionEvaluation(rightExpr, mapping);
          const right = rightTerm.coerceEBV();
          return bool(right);
        } catch (error: unknown) {
          const rightErrorTerm = await exprEval.evaluatorExpressionEvaluation(rightExpr, mapping);
          const rightError = rightErrorTerm.coerceEBV();
          if (!rightError) {
            throw error;
          }
          return bool(true);
        }
      },
    });
  }
}
