# 🛒 Serverless E-Commerce Order Processing System

A fully functional, production-ready serverless e-commerce platform built entirely on AWS infrastructure. This project demonstrates modern cloud architecture using Infrastructure as Code (CloudFormation), serverless compute (Lambda), and a globally distributed frontend (CloudFront + S3).

## 🎯 Project Overview

I built this project to learn AWS serverless architecture and CloudFormation. What started as a learning exercise turned into a fully functional e-commerce order processing system that can handle real transactions.

### What It Does

- Displays a product catalog with an interactive shopping cart
- Processes customer orders through a serverless backend
- Stores order data in a NoSQL database
- Serves the website globally with HTTPS
- Protects against common web attacks with AWS WAF

## 🏗️ Architecture

### High-Level Design
```
User Browser
    ↓
CloudFront (CDN + HTTPS)
    ↓
S3 Bucket (Static Website)
    ↓
Lambda Function URL ──→ Lambda Function ──→ DynamoDB
    ↑
AWS WAF (Security Layer)
```

### Components

**Frontend Layer:**
- **Amazon S3**: Hosts static website files (HTML, CSS, JavaScript)
- **CloudFront**: Global CDN for fast content delivery with HTTPS
- **AWS WAF**: Protects CloudFront from SQL injection, XSS, and OWASP Top 10 threats

**Backend Layer:**
- **AWS Lambda**: Serverless function processes orders (Python 3.11)
- **Lambda Function URL**: Direct HTTPS endpoint to Lambda (bypasses API Gateway)
- **API Gateway**: Alternative REST API endpoint (also configured)
- **AWS WAF**: Protects API endpoints from malicious requests

**Data Layer:**
- **DynamoDB**: NoSQL database stores order data with pay-per-request billing

**Infrastructure:**
- **CloudFormation**: Entire infrastructure defined as code (IaC)
- **IAM Roles**: Secure permissions for Lambda to access DynamoDB

## 🚀 Deployment Guide

### Prerequisites

- AWS Account
- AWS CLI installed and configured
- Basic understanding of AWS services

### Step 1: Deploy CloudFormation Stack

1. Clone this repository:
```bash
git clone https://github.com/YOUR-USERNAME/Serverless-Ecommerce-Site.git
cd Serverless-Ecommerce-Site
```

2. Deploy the stack:
```bash
aws cloudformation create-stack \
  --stack-name ecommerce-order-system \
  --template-body file://ecommerce-stack.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

3. Wait for deployment (10-15 minutes):
```bash
aws cloudformation wait stack-create-complete \
  --stack-name ecommerce-order-system \
  --region us-east-1
```

### Step 2: Configure Lambda Function URL

After stack creation, you need to create a Lambda Function URL:

1. Go to AWS Lambda console
2. Click on `ecommerce-order-system-process-order`
3. Go to Configuration → Function URL
4. Click "Create function URL"
   - **Auth type**: NONE
   - **Invoke mode**: BUFFERED
   - **IMPORTANT**: Do NOT enable CORS here (Lambda code handles it)
5. Copy the Function URL

### Step 3: Update Frontend Configuration

1. Open `script.js`
2. Replace the placeholder API endpoint:
```javascript
const API_ENDPOINT = 'YOUR_LAMBDA_FUNCTION_URL_HERE';
```

With your actual Lambda Function URL:
```javascript
const API_ENDPOINT = 'https://your-actual-url.lambda-url.us-east-1.on.aws/';
```

### Step 4: Upload Website Files to S3

1. Get your S3 bucket name from CloudFormation outputs:
```bash
aws cloudformation describe-stacks \
  --stack-name ecommerce-order-system \
  --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
  --output text
```

2. Upload files:
```bash
aws s3 cp index.html s3://YOUR-BUCKET-NAME/
aws s3 cp style.css s3://YOUR-BUCKET-NAME/
aws s3 cp script.js s3://YOUR-BUCKET-NAME/
```

### Step 5: Access Your Website

Get your CloudFront URL:
```bash
aws cloudformation describe-stacks \
  --stack-name ecommerce-order-system \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
  --output text
```

Visit the URL and start shopping! 🛍️

## 🔧 Challenges I Overcame

Building this project taught me a lot about AWS and troubleshooting production issues. Here are the main challenges I faced and how I solved them:

### 1. S3 Bucket Name Conflicts
**Problem**: CloudFormation failed because bucket names must be globally unique.

**Solution**: Added `${AWS::AccountId}` to bucket name to ensure uniqueness:
```yaml
BucketName: !Sub '${ProjectName}-website-${AWS::AccountId}'
```

### 2. Duplicate S3 Bucket Policies
**Problem**: Created two separate bucket policies, but AWS only allows one per bucket.

**Solution**: Combined both policies into a single `WebsiteBucketPolicy` resource with multiple statements.

### 3. CloudFront + WAF Association Error
**Problem**: Used separate `AWS::WAFv2::WebACLAssociation` resource, causing ARN format issues.

**Solution**: Added `WebACLId` directly inside CloudFront distribution configuration:
```yaml
CloudFrontDistribution:
  Properties:
    DistributionConfig:
      WebACLId: !GetAtt WebACL.Arn
```

### 4. DNS Propagation Issues
**Problem**: API Gateway endpoints took 30+ minutes to resolve on my network, causing "DNS_PROBE_FINISHED_NXDOMAIN" errors.

**Solution**: Switched to **Lambda Function URLs** which work immediately without DNS propagation delays. This was a game-changer!

### 5. Duplicate CORS Headers
**Problem**: Got error: "The 'Access-Control-Allow-Origin' header contains multiple values '*, *'"

**Root Cause**: Both Lambda Function URL CORS config AND Lambda function code were adding CORS headers.

**Solution**: Disabled CORS in Function URL configuration since Lambda code already handles it properly.

### 6. DynamoDB Float Type Error
**Problem**: "Float types are not supported. Use Decimal types instead."

**Solution**: Added conversion function in Lambda to convert JavaScript floats to Python Decimals:
```python
from decimal import Decimal

def convert_floats(obj):
    if isinstance(obj, float):
        return Decimal(str(obj))
    # ... handle lists and dicts recursively
```

## 💰 Cost Breakdown

Monthly costs (as of deployment):

| Service | Cost | Notes |
|---------|------|-------|
| **Lambda** | ~$0 | Free tier: 1M requests/month |
| **DynamoDB** | ~$0 | Free tier: 25GB storage |
| **S3** | ~$0.01 | Minimal storage costs |
| **CloudFront** | ~$0.10 | Free tier: 1TB transfer/month |
| **API Gateway** | ~$0 | Free tier: 1M requests/month |
| **AWS WAF** | **$10-12** | Main cost: $5/Web ACL + $1/million requests |

**Total: ~$10-12/month** (mostly WAF)

**Cost Optimization**: You can remove WAF for testing to reduce costs to nearly $0, but I kept it for production-ready security.

## 🛡️ Security Features

- ✅ **HTTPS Only**: All traffic encrypted via CloudFront
- ✅ **AWS WAF**: Protects against OWASP Top 10 threats
  - SQL Injection protection
  - Cross-Site Scripting (XSS) protection
  - Known bad inputs blocking
- ✅ **CORS**: Properly configured to allow only necessary origins
- ✅ **IAM Roles**: Least privilege access for Lambda
- ✅ **No Hardcoded Credentials**: Everything uses IAM roles

## 📊 Testing the System

### Test Order Placement

1. Visit your CloudFront URL
2. Add products to cart (Smartphone X, Laptop Pro, etc.)
3. Enter your name in checkout
4. Click "Place Order"
5. You should see: "🎉 Order placed successfully! Order ID: [uuid]"

### Verify in DynamoDB
```bash
aws dynamodb scan \
  --table-name ecommerce-order-system-orders \
  --region us-east-1
```

Or use the AWS Console:
1. Go to DynamoDB
2. Click `ecommerce-order-system-orders`
3. Click "Explore table items"
4. See all your orders!

## 📁 Project Structure
```
Serverless-Ecommerce-Site/
├── ecommerce-stack.yaml    # CloudFormation template (IaC)
├── index.html              # Product catalog page
├── style.css               # Responsive styling
├── script.js               # Shopping cart logic + API calls
├── test.html               # Diagnostic tool (optional)
└── README.md               # This file
```

## 🧪 Lambda Function

The Lambda function (`process-order`) handles:
- Parsing incoming order data
- Converting float values to Decimals for DynamoDB
- Generating unique order IDs (UUID)
- Storing orders in DynamoDB
- Returning success/error responses
- CORS headers for browser requests

**Runtime**: Python 3.11  
**Memory**: 128 MB  
**Timeout**: 30 seconds

## 🎓 What I Learned

This project taught me:

1. **CloudFormation**: How to define entire AWS infrastructure as code
2. **Serverless Architecture**: Building without managing servers
3. **Troubleshooting**: Debugging DNS, CORS, and data type issues
4. **AWS Services**: Hands-on experience with 8+ AWS services
5. **Production Readiness**: Security, monitoring, and cost optimization
6. **Problem Solving**: Each error taught me something new about AWS

## 🔮 Future Enhancements

Ideas for v2.0:

- [ ] User authentication with Amazon Cognito
- [ ] Email notifications using Amazon SES
- [ ] Payment processing integration (Stripe API)
- [ ] Admin dashboard to view all orders
- [ ] Product inventory management
- [ ] Order status tracking
- [ ] Multiple product categories
- [ ] Search functionality
- [ ] Real-time updates with WebSockets (API Gateway)

## 📝 License

This project is open source and available under the MIT License.

*Last Updated: October 2025*

