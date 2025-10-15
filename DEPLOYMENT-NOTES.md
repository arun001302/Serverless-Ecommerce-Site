# Deployment Notes & Troubleshooting

## Common Issues

### Issue: DNS Propagation Delays
If API Gateway endpoint doesn't resolve immediately, use Lambda Function URLs instead.

### Issue: CORS Errors
Make sure CORS is NOT enabled in Lambda Function URL config. The Lambda code handles it.

### Issue: Float Type Errors
Lambda code includes Decimal conversion. Make sure you deployed the updated version.

## Quick Commands

### Deploy Stack
```bash
aws cloudformation create-stack --stack-name ecommerce-order-system --template-body file://ecommerce-stack.yaml --capabilities CAPABILITY_NAMED_IAM --region us-east-1
```

### Update Stack
```bash
aws cloudformation update-stack --stack-name ecommerce-order-system --template-body file://ecommerce-stack.yaml --capabilities CAPABILITY_NAMED_IAM --region us-east-1
```

### Delete Stack
```bash
aws cloudformation delete-stack --stack-name ecommerce-order-system --region us-east-1
```