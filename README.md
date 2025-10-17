# Serverless E-Commerce Order Processing System

A production-ready serverless shopping cart and order processing system built entirely with AWS services and Infrastructure as Code (CloudFormation).

## 🚀 Project Overview

This project demonstrates a fully serverless e-commerce platform with:
- Shopping cart functionality
- Order processing backend
- Global CDN delivery
- Enterprise-grade security
- Zero server management

## 🏗️ Architecture

- **Frontend**: Static website hosted on S3, delivered via CloudFront CDN
- **Backend**: AWS Lambda function for order processing
- **Database**: DynamoDB for storing orders
- **API**: API Gateway REST API with custom domain
- **Security**: AWS WAF with OWASP protections
- **SSL/TLS**: ACM certificates for HTTPS
- **DNS**: Route 53 for custom domain management

## 🛠️ Technologies Used

- AWS CloudFormation (Infrastructure as Code)
- AWS Lambda (Python 3.12)
- Amazon DynamoDB
- Amazon S3
- Amazon CloudFront
- AWS API Gateway
- AWS WAF (Web Application Firewall)
- AWS Certificate Manager (ACM)
- Amazon Route 53
- HTML/CSS/JavaScript

## 📋 Prerequisites

- AWS Account
- AWS CLI configured
- Custom domain (optional)
- ACM certificate for custom domains (optional)

## 🚀 Deployment Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. (Optional) Request SSL Certificate

If using custom domains:
1. Go to AWS Certificate Manager (us-east-1 region)
2. Request a certificate for `*.yourdomain.com` and `yourdomain.com`
3. Use DNS validation with Route 53
4. Wait for "Issued" status
5. Copy the certificate ARN

### 3. Update CloudFormation Template

Edit `ecommerce-stack.yaml`:
- Replace `architecture-demo.com` with your domain (or remove custom domain sections)
- Update certificate ARN if using custom domains
- Modify `ProjectName` parameter if desired

### 4. Deploy the Stack

**Via AWS CLI:**

```bash
aws cloudformation create-stack \
  --stack-name ecommerce-order-system \
  --template-body file://ecommerce-stack.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

**Via AWS Console:**
1. Go to CloudFormation in AWS Console
2. Click "Create stack"
3. Upload `ecommerce-stack.yaml`
4. Enter stack name: `ecommerce-order-system`
5. Click Next → Next → Check IAM acknowledgment → Create

### 5. Wait for Deployment

Deployment takes approximately 20-30 minutes (CloudFront distribution is slow).

Watch the Events tab for progress.

### 6. Upload Frontend Files

After stack creation completes:

```bash
# Get your S3 bucket name from CloudFormation Outputs
aws s3 cp index.html s3://YOUR-BUCKET-NAME/
aws s3 cp styles.css s3://YOUR-BUCKET-NAME/
aws s3 cp script.js s3://YOUR-BUCKET-NAME/
```

Or upload via S3 Console.

### 7. Update API Endpoint in Frontend

Edit `script.js` and update the API endpoint:

```javascript
const API_ENDPOINT = 'https://YOUR-API-ENDPOINT/orders';
```

Get your API endpoint from CloudFormation Outputs tab.

Re-upload `script.js` to S3.

## 🧪 Testing

### Test the Website

1. Get CloudFront URL from CloudFormation Outputs
2. Open in browser: `https://YOUR-CLOUDFRONT-URL.cloudfront.net`
3. Add items to cart
4. Enter customer name
5. Click "Place Order"

### Test the API Directly

```bash
curl -X POST https://YOUR-API-ENDPOINT/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "items": [{"name": "Test Item", "price": 99.99}],
    "totalAmount": 99.99
  }'
```

### Verify Orders in DynamoDB

1. Go to DynamoDB Console
2. Open table: `ecommerce-orders`
3. Click "Explore table items"
4. View your test orders

## 📊 Project Structure

```
.
├── ecommerce-stack.yaml    # CloudFormation template (Infrastructure as Code)
├── index.html              # Frontend - Main page
├── styles.css              # Frontend - Styling
├── script.js               # Frontend - Shopping cart logic
└── README.md               # This file
```

## 🔒 Security Features

- AWS WAF with OWASP Top 10 protections
- HTTPS/SSL encryption via CloudFront and ACM
- CORS configured for API security
- IAM roles with least-privilege permissions
- SQL injection protection
- Rate limiting via WAF

## 💰 Cost Estimate

With AWS Free Tier:
- **Lambda**: 1M free requests/month
- **DynamoDB**: 25GB storage + 25 RCU/WCU free
- **S3**: 5GB free storage
- **CloudFront**: 1TB free data transfer (12 months)
- **API Gateway**: 1M free requests/month (12 months)

**Expected monthly cost: ~$0-5** for low traffic

## 🗑️ Cleanup

To avoid ongoing charges, delete the stack:

```bash
aws cloudformation delete-stack --stack-name ecommerce-order-system --region us-east-1
```

Or via Console:
1. CloudFormation → Select stack
2. Click "Delete"

**Note**: Manually delete S3 bucket contents first if bucket has objects.

## 📚 What I Learned

- AWS CloudFormation and Infrastructure as Code principles
- Serverless architecture patterns
- AWS Lambda function development
- DynamoDB NoSQL database operations
- CloudFront CDN configuration
- API Gateway REST API design
- AWS WAF security implementation
- SSL/TLS certificate management

## 🎯 Future Enhancements

- [ ] Add user authentication (AWS Cognito)
- [ ] Implement payment processing (Stripe integration)
- [ ] Add order history page
- [ ] Email notifications (SES)
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Multi-region deployment

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Pull requests are welcome! Feel free to fork this project and submit improvements.

## 📧 Contact

For questions or feedback, please open an issue in this repository.

---

**Built as part of AWS Cloud Bootcamp Project** ☁️

